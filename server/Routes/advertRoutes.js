import express from 'express';
import {
  activateAdvert,
  archiveAdvert,
  createAdvert,
  deleteAdvert,
  getActiveAdverts,
  getAllAdverts,
  getSpecificAdvert,
  updateAdvert,
} from '../Controller/advertsController.js';
import checkAdvert from '../Middlewares/checkAdvert.js';
import checkToken from '../Middlewares/checkToken.js';
import upload from '../Middlewares/uplaod.js';

const router = express.Router();

router.post(
  '/add',
  checkToken,
  upload.array('images'),
  checkAdvert,
  createAdvert
);
router.get('', getAllAdverts);
router.get('/active', getActiveAdverts);
router.get('/:itemId', getSpecificAdvert);
router.patch(
  '/:itemId',
  checkToken,
  upload.array('images'),
  checkAdvert,
  updateAdvert
);
router.delete('/:itemId', checkToken, deleteAdvert);
router.patch('/activate/:itemId', checkToken, activateAdvert);
router.patch('/archive/:itemId', checkToken, archiveAdvert);

export default router;
