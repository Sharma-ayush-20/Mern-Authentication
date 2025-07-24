import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authControllers.js';
import userAuth from '../middlewares/userAuth.js';

const authRouter = express.Router();

authRouter.route('/register').post(register);
authRouter.route('/login').post(login);
authRouter.route('/logout').post(logout);

//email verification
authRouter.route('/send-verify-otp').post(userAuth, sendVerifyOtp);
authRouter.route('/verify-account').post(userAuth, verifyEmail);
authRouter.route('/is-auth').get(userAuth, isAuthenticated);

//forgot password
authRouter.route('/send-reset-otp').post(sendResetOtp);
authRouter.route('/reset-password').post(resetPassword);

export default authRouter;