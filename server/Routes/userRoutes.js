import express from 'express';
import { addUser, login } from '../Controller/usersController.js';

const router = express.Router();

router.post('/add', addUser);
router.post('/login', login);

export default router;
