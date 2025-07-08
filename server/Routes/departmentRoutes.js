import express from 'express';
import {
  activateDepartment,
  archiveDepartment,
  createDepartment,
  deleteDepartment,
  getActiveDepartment,
  getAllDepartment,
  getSpecificDepartment,
  updateDepartment,
  getDepartmentServices,
} from '../Controller/departmentController.js';
import checkDepartment from '../Middlewares/checkDepartment.js';
import checkToken from '../Middlewares/checkToken.js';
import upload from '../Middlewares/uplaod.js';

const router = express.Router();

router.post(
  '/add',
  checkToken,
  upload.single('image'),
  checkDepartment,
  createDepartment
);
router.get('', getAllDepartment);
router.get('/active', getActiveDepartment);
router.get('/:itemId', getSpecificDepartment);
router.patch(
  '/:itemId',
  checkToken,
  upload.single('image'),
  checkDepartment,
  updateDepartment
);
router.delete('/:itemId', checkToken, deleteDepartment);
router.patch('/activate/:itemId', checkToken, activateDepartment);
router.patch('/archive/:itemId', checkToken, archiveDepartment);
router.get('/:itemId/services', getDepartmentServices);

export default router;
