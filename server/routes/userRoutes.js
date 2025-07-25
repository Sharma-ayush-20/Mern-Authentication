import express from 'express';
import userAuth from '../middlewares/userAuth.js';
import getUserData from '../controllers/userControllers.js';

const userRouter = express.Router()

userRouter.route('/data').get(userAuth, getUserData)

export default userRouter;