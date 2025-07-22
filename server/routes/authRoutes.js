import express from 'express';
import { login, logout, register } from '../controllers/authControllers.js';

const authRouter = express.Router();

authRouter.route('/register').post(register);
authRouter.route('/login').post(login);
authRouter.route('/logout').post(logout);

export default authRouter;