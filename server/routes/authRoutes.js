import express from 'express';
import { login, logout, register, sendVerifyOtp, verifyEmail } from '../controllers/authControllers.js';
import userAuth from '../middlewares/userAuth.js';

const authRouter = express.Router();

authRouter.route('/register').post(register);
authRouter.route('/login').post(login);
authRouter.route('/logout').post(logout);
authRouter.route('/send-verify-otp').post(userAuth, sendVerifyOtp);
authRouter.route('/verify-account').post(userAuth, verifyEmail);

export default authRouter;