require('dotenv').config();
const mongoose = require('mongoose', {useCreateIndex: true});
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(`MongoDB Connected: ${process.env.MONGO_URI}`))
    .catch((err) => console.log(err));
const express = require('express');
const userRouter = require('./userRoutes');
const app = express();
const PORT = process.env.PORT || 4001;
app.use(express.json());
app.use('/api/user', userRouter);
app.listen(PORT, () => {
    console.log('Backend Task Port: '+ PORT);
});