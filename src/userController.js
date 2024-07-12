const User = require('./userSchema');
const VerificationToken = require('./userVerifcation');
const ResetToken = require('./userResetPassword');
const { sendError, createRandomBytes } = require('./userUtils');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { isValidObjectId } = require('mongoose');
const { 
    generateOTP, 
    mailTransport, 
    generateEmailTemplate, 
    successEmailTemplate,
    passwordResetTemplate
} = require('./userEmail');
exports.createUser = async (req, res) => {
    const {name, email, password} = req.body;
    const user = await User.findOne({email});
    if (user) return sendError(res, 'This email already exist');
    const newUser = new User({
        name,
        email,
        password,
    });
    const OTP = generateOTP();
    const verificationToken = new VerificationToken({
        owner: newUser._id,
        token: OTP
    });
    await verificationToken.save();
    await newUser.save();
    mailTransport().sendMail({
        from: process.env.EMAIL_USER,
        to: newUser.email,
        subject: 'ZapHub, Sign-up Code: '+ OTP,
        html: generateEmailTemplate(OTP)
    });
    res.send(newUser);
};
exports.signin = async (req, res) => {
    const {email, password} = req.body;
    if(!email.trim() || !password.trim()) return sendError(res, 'Email or Password is missing');
    const user = await User.findOne({email});
    if(!user) return sendError(res, 'User not found');
    const isMatched = await user.comparePassword(password);
    if(!isMatched) return sendError(res, 'Email or Password doesn\'t match');
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
    res.json({
        success: true, 
        user: {
            name: user.name,
            email: user.email,
            id: user._id,
            token
        },
    });
};
exports.verifyEmail = async (req, res) => {
    const {userId, otp} = req.body;
    if(!userId || !otp.trim()) return sendError(res, 'Invalid request, missing parameters');
    if(!isValidObjectId(userId)) return sendError(res, 'Invalid user id');
    const user = await User.findById(userId);
    if(!user) return sendError(res, 'Sorry, user not found');
    if(user.emailVerified) return sendError(res, 'This account is already verified');
    const token = await VerificationToken.findOne({owner: user._id});
    if(!token) return sendError(res, 'Sorry, user not found');
    const isMatched = await token.compareToken(otp);
    if(!isMatched) return sendError(res, 'Please provide a valid token');
    user.emailVerified = true;
    await VerificationToken.findByIdAndDelete(token._id);
    await user.save();
    mailTransport().sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'ZapHub Sign-up Successful',
        html: successEmailTemplate(
            'Email verified successfully',
            'Thanks you for using ZapHub' 
        )
    });
    res.json({
        success: true, 
        message: 'your email is verified',
        user: {
            name: user.name,
            email: user.email,
            id: user._id
        },
    });
};
exports.forgotPassword = async (req, res) => {
    const {email} = req.body;
    if(!email) return sendError(res, 'Please provide a valid email');
    const user = await User.findOne({email});
    if(!user) return sendError(res, 'User not found, invalid request');
    const token = await ResetToken.findOne({owner: user._id});
    if(token) return sendError(res, 'You can only request one token per hour');
    const randomBytes = await createRandomBytes();
    const resetToken = new ResetToken({owner: user._id, token: randomBytes});
    await resetToken.save();
    mailTransport().sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'ZapHub Forgot Password',
        html: passwordResetTemplate(process.env.FRONTEND_URL+`restore?token=${randomBytes}&id=${user._id}`)
    });
    res.json({
        success: true,
        message: 'Password reset link is sent to your email'
    });
};
exports.resetPassword = async (req, res) => {
    const {password} = req.body;
    const user = await User.findById(req.user._id);
    if(!user) return sendError(res, 'User not found');
    const isSamePassword = await user.comparePassword(password);
    if(isSamePassword) return sendError(res, 'New and old password can\'t match');
    if(password.trim().length < 8 || password.trim().length > 32) return sendError(res, 'Password must be 8 to 32 characters');
    user.password = password.trim();
    await user.save();
    await ResetToken.findOneAndDelete({owner: user._id});
    mailTransport().sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Zaphub Password Reset Successful',
        html: successEmailTemplate(
            'Pasword Reset Successfully',
            'Now you can login with your new password'
        )
    });
    res.json({
        success: true, 
        message: 'Pasword Reset Successfully'
    });
};