import express from 'express';
import {
  activateFooterLink,
  archiveFooterLink,
  createFooterLink,
  deleteFooterLink,
  getActiveFooterLinks,
  getAllFooterLinks,
  getSpecificFooterLink,
  updateFooterLink,
} from '../Controller/footerLinksController.js';
import checkToken from '../Middlewares/checkToken.js';

const router = express.Router();

router.post('/add', checkToken, createFooterLink);
router.get('', getAllFooterLinks);
router.get('/active', getActiveFooterLinks);
router.get('/:itemId', getSpecificFooterLink);
router.patch('/:itemId', checkToken, updateFooterLink);
router.delete('/:itemId', checkToken, deleteFooterLink);
router.patch('/activate/:itemId', checkToken, activateFooterLink);
router.patch('/archive/:itemId', checkToken, archiveFooterLink);

export default router;
