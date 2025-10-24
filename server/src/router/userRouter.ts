import express from 'express';
import { register, login, logout, findUser, getAllUser } from '../controllers/userController.ts';
import { getFamilyName } from '../controllers/appController.ts';

const userRouter = express.Router();

userRouter.get('/family-name', getFamilyName);
userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/find-user/:id', findUser);
userRouter.post('/get-all-user', getAllUser);
userRouter.get('/logout', logout);

export default userRouter;
