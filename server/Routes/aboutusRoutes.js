import express from 'express';
import {
  activateAboutus,
  archiveAboutus,
  createAboutus,
  deleteAboutus,
  getActiveAboutus,
  getAllAboutus,
  getSpecificAboutus,
  updateAboutus,
} from '../Controller/aboutusController.js';
import checkAboutus from '../Middlewares/checkAboutus.js';
import checkToken from '../Middlewares/checkToken.js';

const router = express.Router();

router.post('/add', checkToken, checkAboutus, createAboutus);
router.get('', getAllAboutus);
router.get('/active', getActiveAboutus);
router.get('/:itemId', getSpecificAboutus);
router.patch('/:itemId', checkToken, checkAboutus, updateAboutus);
router.delete('/:itemId', checkToken, deleteAboutus);
router.patch('/activate/:itemId', checkToken, activateAboutus);
router.patch('/archive/:itemId', checkToken, archiveAboutus);

export default router;
