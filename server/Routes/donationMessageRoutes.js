import express from 'express';
import {
  activateDonationMessage,
  archiveDonationMessage,
  createDonationMessage,
  deleteDonationMessage,
  getactiveDonationMessage,
  getAllMoreOnUs,
  getSpecificDonationMessage,
  updateDonationMessage,
} from '../Controller/donationMessageController.js';
import checkDonationMessage from '../Middlewares/checkDonationMessage.js';
import checkToken from '../Middlewares/checkToken.js';

const router = express.Router();

router.post('/add', checkToken, checkDonationMessage, createDonationMessage);
router.get('', getAllMoreOnUs);
router.get('/active', getactiveDonationMessage);
router.get('/:itemId', getSpecificDonationMessage);
router.patch('/:itemId', checkToken, checkDonationMessage, updateDonationMessage);
router.delete('/:itemId', checkToken, deleteDonationMessage);
router.patch('/activate/:itemId', checkToken, activateDonationMessage);
router.patch('/archive/:itemId', checkToken, archiveDonationMessage);

export default router;
