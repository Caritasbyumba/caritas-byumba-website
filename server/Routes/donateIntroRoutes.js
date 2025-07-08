import express from 'express';
import {
  activateDonateIntro,
  archiveDonateIntro,
  createDonateIntro,
  deleteDonateIntro,
  getActiveDonateIntros,
  getAllDonateIntros,
  getSpecificDonateIntro,
  updateDonateIntro,
} from '../Controller/donateController.js';
import checkIntro from '../Middlewares/checkIntro.js';
import checkToken from '../Middlewares/checkToken.js';

const router = express.Router();

router.post('/add', checkToken, checkIntro, createDonateIntro);
router.get('', getAllDonateIntros);
router.get('/active', getActiveDonateIntros);
router.get('/:itemId', getSpecificDonateIntro);
router.patch('/:itemId', checkToken, checkIntro, updateDonateIntro);
router.delete('/:itemId', checkToken, deleteDonateIntro);
router.patch('/activate/:itemId', checkToken, activateDonateIntro);
router.patch('/archive/:itemId', checkToken, archiveDonateIntro);

export default router;
