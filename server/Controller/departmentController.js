import { errorResponse, successResponse } from '../Helpers/responses.js';
import Department from '../Models/Department.js';
import Service from '../Models/Service.js';
import fs from 'fs';

export const createDepartment = async (req, res) => {
  try {
    const {
      enName,
      frName,
      rwName,
      enDescription,
      frDescription,
      rwDescription,
      enSmallDescription,
      frSmallDescription,
      rwSmallDescription,
    } = req.body;
    const userId = req.tokenData._id;
    let fileName = '';
    if (req.file) {
      fileName = req.file.filename;
    }
    const newDepartment = new Department({
      name: { en: enName, fr: frName, rw: rwName },
      description: {
        en: enDescription,
        fr: frDescription,
        rw: rwDescription,
      },
      smallDescription: {
        en: enSmallDescription,
        fr: frSmallDescription,
        rw: rwSmallDescription,
      },
      image: fileName,
      createdBy: userId,
      updatedBy: userId,
    });
    const department = await newDepartment.save();
    return successResponse(
      res,
      201,
      'Department created successfully',
      department
    );
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(`public/images/${req.file.filename}`);
    }
    return errorResponse(res, 500, error.message);
  }
};

export const getAllDepartment = async (req, res) => {
  try {
    const department = await Department.find({})
      .populate(['createdBy', 'updatedBy'])
      .sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'Department retrieved successfully',
      department
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getActiveDepartment = async (req, res) => {
  try {
    const department = await Department.find({
      isActive: true,
    }).sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'Department retrieved successfully',
      department
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSpecificDepartment = async (req, res) => {
  try {
    const { itemId } = req.params;
    const departmentFound = await Department.findOne({ _id: itemId }).populate([
      'createdBy',
      'updatedBy',
    ]);
    if (!departmentFound) {
      return errorResponse(res, 404, 'Department not found');
    }
    return successResponse(
      res,
      200,
      'Department retrieved successfully',
      departmentFound
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { itemId } = req.params;
    const departmentFound = await Department.findOne({ _id: itemId });
    if (!departmentFound) {
      return errorResponse(res, 404, 'Department not found');
    }
    const {
      enName,
      frName,
      rwName,
      enDescription,
      frDescription,
      rwDescription,
      enSmallDescription,
      frSmallDescription,
      rwSmallDescription,
    } = req.body;
    const userId = req.tokenData._id;
    let department;
    if (req.file?.filename) {
      if(departmentFound.image){
        fs.unlinkSync(`public/images/${departmentFound.image}`);
      }
      department = await Department.findOneAndUpdate(
        { _id: itemId },
        {
          $set: {
            name: { en: enName, fr: frName, rw: rwName },
            description: {
              en: enDescription,
              fr: frDescription,
              rw: rwDescription,
            },
            smallDescription: {
              en: enSmallDescription,
              fr: frSmallDescription,
              rw: rwSmallDescription,
            },
            image: req.file.filename,
            updatedBy: userId,
          },
        },
        { new: true }
      ).populate(['createdBy', 'updatedBy']);
    } else {
      department = await Department.findOneAndUpdate(
        { _id: itemId },
        {
          $set: {
            name: { en: enName, fr: frName, rw: rwName },
            description: {
              en: enDescription,
              fr: frDescription,
              rw: rwDescription,
            },
            smallDescription: {
              en: enSmallDescription,
              fr: frSmallDescription,
              rw: rwSmallDescription,
            },
            updatedBy: userId,
          },
        },
        { new: true }
      ).populate(['createdBy', 'updatedBy']);
    }
    return successResponse(
      res,
      200,
      'Department edited successfully',
      department
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { itemId } = req.params;
    const departmentFound = await Department.findOne({ _id: itemId });
    if (!departmentFound) {
      return errorResponse(res, 404, 'Department not found');
    }
    await Department.deleteOne({ _id: itemId });
    if(departmentFound.image){
      fs.unlinkSync(`public/images/${departmentFound.image}`);
    }
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const activateDepartment = async (req, res) => {
  try {
    const { itemId } = req.params;
    const departmentFound = await Department.findOne({ _id: itemId });
    if (!departmentFound) {
      return errorResponse(res, 404, 'Department not found');
    }
    const userId = req.tokenData._id;
    const department = await Department.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: true,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(
      res,
      200,
      'Department edited successfully',
      department
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const archiveDepartment = async (req, res) => {
  try {
    const { itemId } = req.params;
    const departmentFound = await Department.findOne({ _id: itemId });
    if (!departmentFound) {
      return errorResponse(res, 404, 'Department not found');
    }
    const userId = req.tokenData._id;
    const department = await Department.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: !departmentFound.isActive,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(
      res,
      200,
      'Department edited successfully',
      department
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getDepartmentServices = async (req, res) => {
  try {
    const { itemId } = req.params;
    const departmentFound = await Department.findOne({ _id: itemId });
    if (!departmentFound) {
      return errorResponse(res, 404, 'Department not found');
    }
    const services = await Service.find({ department: itemId });
    return successResponse(
      res,
      200,
      'Services retrieved successfully',
      services
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
