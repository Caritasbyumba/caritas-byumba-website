import express from 'express';
import {
  activateFooterAddress,
  archiveFooterAddress,
  createFooterAddress,
  deleteFooterAddress,
  getActiveFooterAddress,
  getAllFooterAddress,
  getSpecificFooterAddress,
  updateFooterAddress,
} from '../Controller/footerAddressController.js';
import checkToken from '../Middlewares/checkToken.js';

const router = express.Router();

router.post('/add', checkToken, createFooterAddress);
router.get('', getAllFooterAddress);
router.get('/active', getActiveFooterAddress);
router.get('/:itemId', getSpecificFooterAddress);
router.patch('/:itemId', checkToken, updateFooterAddress);
router.delete('/:itemId', checkToken, deleteFooterAddress);
router.patch(
  '/activate/:itemId',
  checkToken,
  activateFooterAddress
);
router.patch(
  '/archive/:itemId',
  checkToken,
  archiveFooterAddress
);

export default router;
