import express from 'express';
import { register, login, findUser, getAllUser } from '../controllers/userController.ts';
import { getFamilyName } from '../controllers/appController.ts';

const router = express.Router();

router.get('/family-name', getFamilyName);
router.post('/register', register);
router.post('/login', login);
router.get('/find-user/:id', findUser);
router.post('/get-all-user', getAllUser);

export default router;
