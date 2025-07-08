import express from 'express';
import {
  activateService,
  archiveService,
  createService,
  deleteService,
  getActiveService,
  getAllService,
  getSpecificService,
  updateService,
} from '../Controller/serviceController.js';
import checkService from '../Middlewares/checkService.js';
import checkToken from '../Middlewares/checkToken.js';
import upload from '../Middlewares/uplaod.js';

const router = express.Router();

router.post(
  '/add',
  checkToken,
  upload.single('image'),
  checkService,
  createService
);
router.get('', getAllService);
router.get('/active', getActiveService);
router.get('/:itemId', getSpecificService);
router.patch(
  '/:itemId',
  checkToken,
  upload.single('image'),
  checkService,
  updateService
);
router.delete('/:itemId', checkToken, deleteService);
router.patch('/activate/:itemId', checkToken, activateService);
router.patch('/archive/:itemId', checkToken, archiveService);

export default router;
