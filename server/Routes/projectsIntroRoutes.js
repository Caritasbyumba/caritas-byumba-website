import express from 'express';
import {
  activateProjectsIntro,
  archiveProjectsIntro,
  createProjectsIntro,
  deleteProjectsIntro,
  getActiveProjectsIntros,
  getAllProjectsIntros,
  getSpecificProjectsIntro,
  updateProjectsIntro,
} from '../Controller/projectSController.js';
import checkIntro from '../Middlewares/checkIntro.js';
import checkToken from '../Middlewares/checkToken.js';

const router = express.Router();

router.post('/add', checkToken, checkIntro, createProjectsIntro);
router.get('', getAllProjectsIntros);
router.get('/active', getActiveProjectsIntros);
router.get('/:itemId', getSpecificProjectsIntro);
router.patch('/:itemId', checkToken, checkIntro, updateProjectsIntro);
router.delete('/:itemId', checkToken, deleteProjectsIntro);
router.patch('/activate/:itemId', checkToken, activateProjectsIntro);
router.patch('/archive/:itemId', checkToken, archiveProjectsIntro);

export default router;
