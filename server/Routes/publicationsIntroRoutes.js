import express from 'express';
import {
  activatePublicationsIntro,
  archivePublicationsIntro,
  createPublicationsIntro,
  deletePublicationsIntro,
  getActivePublicationsIntros,
  getAllPublicationsIntros,
  getSpecificPublicationsIntro,
  updatePublicationsIntro,
} from '../Controller/publicationsController.js';
import checkIntro from '../Middlewares/checkIntro.js';
import checkToken from '../Middlewares/checkToken.js';

const router = express.Router();

router.post('/add', checkToken, checkIntro, createPublicationsIntro);
router.get('', getAllPublicationsIntros);
router.get('/active', getActivePublicationsIntros);
router.get('/:itemId', getSpecificPublicationsIntro);
router.patch('/:itemId', checkToken, checkIntro, updatePublicationsIntro);
router.delete('/:itemId', checkToken, deletePublicationsIntro);
router.patch('/activate/:itemId', checkToken, activatePublicationsIntro);
router.patch('/archive/:itemId', checkToken, archivePublicationsIntro);

export default router;
