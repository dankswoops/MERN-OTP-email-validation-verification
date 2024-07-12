const nodemailer = require('nodemailer');
exports.generateOTP = () => {
    let otp = '';
    for(let i = 0; i <= 5; i++){
        const randomValue = Math.round(Math.random() * 9);
        otp = otp + randomValue;
    };
    return otp;
};
exports.mailTransport = () => nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
exports.generateEmailTemplate = code => {return `
    <!DOCTYPE html>
    <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <style>
                [draggable=false]{
                    user-select:none;/* Chrome & Opera */
                    pointer-events:none;/* General CSS */
                    -o-user-select:none;/* Possibly useless*/
                    -ms-user-select:none;/* IE & Edge */
                    -moz-user-select:none;/* Firefox */
                    -khtml-user-select:none;/* Konqueror HTML */
                    -webkit-user-select:none;/* Safari */
                    -webkit-touch-callout:none;/* iOS Safari */
                    -webkit-tap-highlight-color:transparent;
                    -webkit-tap-highlight-color:rgba(0,0,0,0)
                }
            </style>
        </head>
        <body>
            <div style='font-family: sans-serif; text-align: center;'>
                <h1 draggable='false' style='padding: 10px'>ZapHub</h1>
                <h2 draggable='false' style='font-style: italic;'>The human rights social app</h2>
                <p style='padding-top: 20px'>
                    <span draggable='false'>Your verification code is: </span>
                    <span style='font-style: italic; font-weight: bold;'>${code}</span>
                </p>
                <p style='padding-top: 20px'>This code will expire in 1 hour</p>
            </div>
        </body>
    </html>
`};
exports.successEmailTemplate = (heading, message) => {return `
    <!DOCTYPE html>
    <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <style>
                [draggable=false]{
                    user-select:none;/* Chrome & Opera */
                    pointer-events:none;/* General CSS */
                    -o-user-select:none;/* Possibly useless*/
                    -ms-user-select:none;/* IE & Edge */
                    -moz-user-select:none;/* Firefox */
                    -khtml-user-select:none;/* Konqueror HTML */
                    -webkit-user-select:none;/* Safari */
                    -webkit-touch-callout:none;/* iOS Safari */
                    -webkit-tap-highlight-color:transparent;
                    -webkit-tap-highlight-color:rgba(0,0,0,0)
                }
            </style>
        </head>
        <body>
            <div style='font-family: sans-serif; text-align: center;'>
                <h1 draggable='false' style='padding: 10px'>${heading}</h1>
                <p draggable='false' style='font-style: italic;'>${message}</p>
            </div>
        </body>
    </html>
`};
exports.passwordResetTemplate = url => {return `
    <!DOCTYPE html>
    <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <style>
                [draggable=false]{
                    user-select:none;/* Chrome & Opera */
                    pointer-events:none;/* General CSS */
                    -o-user-select:none;/* Possibly useless*/
                    -ms-user-select:none;/* IE & Edge */
                    -moz-user-select:none;/* Firefox */
                    -khtml-user-select:none;/* Konqueror HTML */
                    -webkit-user-select:none;/* Safari */
                    -webkit-touch-callout:none;/* iOS Safari */
                    -webkit-tap-highlight-color:transparent;
                    -webkit-tap-highlight-color:rgba(0,0,0,0)
                }
            </style>
        </head>
        <body>
            <div style='font-family: sans-serif; text-align: center;'>
                <h1 draggable='false' style='padding: 10px'>ZapHub Reset Password Request</h1>
                <a href='${url}' style='font-style: italic; cursor: pointer'>Reset Password</a>
                <p draggable='false' style='font-weight: bold'>If you did not request this reset, please disregard this link and secure your account in a timely manner!</p>
            </div>
        </body>
    </html>
`};
exports.successEmailTemplate = (heading, message) => {return `
    <!DOCTYPE html>
    <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <style>
                [draggable=false]{
                    user-select:none;/* Chrome & Opera */
                    pointer-events:none;/* General CSS */
                    -o-user-select:none;/* Possibly useless*/
                    -ms-user-select:none;/* IE & Edge */
                    -moz-user-select:none;/* Firefox */
                    -khtml-user-select:none;/* Konqueror HTML */
                    -webkit-user-select:none;/* Safari */
                    -webkit-touch-callout:none;/* iOS Safari */
                    -webkit-tap-highlight-color:transparent;
                    -webkit-tap-highlight-color:rgba(0,0,0,0)
                }
            </style>
        </head>
        <body>
            <div style='font-family: sans-serif; text-align: center;'>
                <h1 draggable='false' style='padding: 10px'>${heading}</h1>
                <p draggable='false' style='font-style: italic;'>${message}</p>
            </div>
        </body>
    </html>
`};