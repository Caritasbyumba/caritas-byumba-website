import express from 'express';
import {
  addMessage,
  filterMessages,
  getAllMessages,
  replyMessage,
} from '../Controller/messageControllers.js';
import checkMessage from '../Middlewares/checkMessage.js';
import checkToken from '../Middlewares/checkToken.js';

const router = express.Router();

router.post('/send', checkMessage, addMessage);
router.get('', checkToken, getAllMessages);
router.get('/:filter', checkToken, filterMessages);
router.patch('/:messageId', checkToken, replyMessage);

export default router;
