import { errorResponse, successResponse } from '../Helpers/responses.js';
import Service from '../Models/Service.js';

export const createService = async (req, res) => {
  try {
    const {
      name,
      enSmallDescription,
      frSmallDescription,
      rwSmallDescription,
      enChallenges,
      frChallenges,
      rwChallenges,
      department,
    } = req.body;
    const userId = req.tokenData._id;
    const newService = new Service({
      name: name,
      smallDescription: {
        en: enSmallDescription,
        fr: frSmallDescription,
        rw: rwSmallDescription,
      },
      challenges: { en: enChallenges, fr: frChallenges, rw: rwChallenges },
      image: req.file.filename,
      department: department,
      createdBy: userId,
      updatedBy: userId,
    });
    const service = await newService.save();
    return successResponse(res, 201, 'Service created successfully', service);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getAllService = async (req, res) => {
  try {
    const service = await Service.find({})
      .populate(['createdBy', 'updatedBy', 'department'])
      .sort({ updatedAt: 'desc' });
    return successResponse(res, 200, 'Service retrieved successfully', service);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getActiveService = async (req, res) => {
  try {
    const services = await Service.find({
      isActive: true,
    })
      .sort({ updatedAt: 'desc' })
      .populate(['createdBy', 'updatedBy', 'department']);
    return successResponse(
      res,
      200,
      'Service retrieved successfully',
      services
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSpecificService = async (req, res) => {
  try {
    const { itemId } = req.params;
    const serviceFound = await Service.findOne({ _id: itemId }).populate([
      'createdBy',
      'updatedBy',
      'department',
    ]);
    if (!serviceFound) {
      return errorResponse(res, 404, 'Service not found');
    }
    return successResponse(
      res,
      200,
      'Service retrieved successfully',
      serviceFound
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateService = async (req, res) => {
  try {
    const { itemId } = req.params;
    const serviceFound = await Service.findOne({ _id: itemId });
    if (!serviceFound) {
      return errorResponse(res, 404, 'Service not found');
    }
    const {
      name,
      enSmallDescription,
      frSmallDescription,
      rwSmallDescription,
      enChallenges,
      frChallenges,
      rwChallenges,
      department,
    } = req.body;
    const userId = req.tokenData._id;
    let service;
    if (req.file?.filename) {
      service = await Service.findOneAndUpdate(
        { _id: itemId },
        {
          $set: {
            name: name,
            smallDescription: {
              en: enSmallDescription,
              fr: frSmallDescription,
              rw: rwSmallDescription,
            },
            challenges: {
              en: enChallenges,
              fr: frChallenges,
              rw: rwChallenges,
            },
            image: req.file.filename,
            department: department,
            updatedBy: userId,
          },
        },
        { new: true }
      ).populate(['createdBy', 'updatedBy']);
    } else {
      service = await Service.findOneAndUpdate(
        { _id: itemId },
        {
          $set: {
            name: name,
            smallDescription: {
              en: enSmallDescription,
              fr: frSmallDescription,
              rw: rwSmallDescription,
            },
            challenges: {
              en: enChallenges,
              fr: frChallenges,
              rw: rwChallenges,
            },
            department: department,
            updatedBy: userId,
          },
        },
        { new: true }
      ).populate(['createdBy', 'updatedBy']);
    }
    return successResponse(res, 200, 'Service edited successfully', service);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deleteService = async (req, res) => {
  try {
    const { itemId } = req.params;
    const serviceFound = await Service.findOne({ _id: itemId });
    if (!serviceFound) {
      return errorResponse(res, 404, 'Service not found');
    }
    await Service.deleteOne({ _id: itemId });
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const activateService = async (req, res) => {
  try {
    const { itemId } = req.params;
    const serviceFound = await Service.findOne({ _id: itemId });
    if (!serviceFound) {
      return errorResponse(res, 404, 'Service not found');
    }
    const userId = req.tokenData._id;
    const service = await Service.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: true,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(res, 200, 'Service edited successfully', service);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const archiveService = async (req, res) => {
  try {
    const { itemId } = req.params;
    const serviceFound = await Service.findOne({ _id: itemId });
    if (!serviceFound) {
      return errorResponse(res, 404, 'Service not found');
    }
    const userId = req.tokenData._id;
    const service = await Service.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: !serviceFound.isActive,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(res, 200, 'Service edited successfully', service);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
