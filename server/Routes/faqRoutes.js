import express from 'express';
import {
  activateFaq,
  archiveFaq,
  createFaq,
  deleteFaq,
  getActiveFaqs,
  getAllFaqs,
  getSpecificFaq,
  updateFaq,
} from '../Controller/faqController.js';
import checkFaq from '../Middlewares/checkFaq.js';
import checkToken from '../Middlewares/checkToken.js';

const router = express.Router();

router.post('/add', checkToken, checkFaq, createFaq);
router.get('', getAllFaqs);
router.get('/active', getActiveFaqs);
router.get('/:itemId', getSpecificFaq);
router.patch('/:itemId', checkToken, checkFaq, updateFaq);
router.delete('/:itemId', checkToken, deleteFaq);
router.patch('/activate/:itemId', checkToken, activateFaq);
router.patch('/archive/:itemId', checkToken, archiveFaq);

export default router;
