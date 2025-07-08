import express from 'express';
import {
  activatePartner,
  archivePartner,
  createPartner,
  deletePartner,
  getActivePartners,
  getAllPartners,
  getSpecificPartner,
  updatePartner,
} from '../Controller/partnerscontroller.js';
import checkPartner from '../Middlewares/checkPartner.js';
import checkToken from '../Middlewares/checkToken.js';
import upload from '../Middlewares/uplaod.js';

const router = express.Router();

router.post(
  '/add',
  checkToken,
  upload.single('image'),
  checkPartner,
  createPartner
);
router.get('', getAllPartners);
router.get('/active', getActivePartners);
router.get('/:itemId', getSpecificPartner);
router.patch(
  '/:itemId',
  checkToken,
  upload.single('image'),
  checkPartner,
  updatePartner
);
router.delete('/:itemId', checkToken, deletePartner);
router.patch('/activate/:itemId', checkToken, activatePartner);
router.patch('/archive/:itemId', checkToken, archivePartner);

export default router;
