import { errorResponse, successResponse } from '../Helpers/responses.js';
import Aboutus from '../models/Aboutus.js';

export const createAboutus = async (req, res) => {
  try {
    const {
      enName,
      frName,
      rwName,
      enDescription,
      frDescription,
      rwDescription,
      enVision,
      frVision,
      rwVision,
      enMission,
      frMission,
      rwMission,
      enObjectives,
      frObjectives,
      rwObjectives,
    } = req.body;
    const userId = req.tokenData._id;
    const newAboutus = new Aboutus({
      name: { en: enName, fr: frName, rw: rwName },
      description: {
        en: enDescription,
        fr: frDescription,
        rw: rwDescription,
      },
      vision: { en: enVision, fr: frVision, rw: rwVision },
      mission: { en: enMission, fr: frMission, rw: rwMission },
      objectives: { en: enObjectives, fr: frObjectives, rw: rwObjectives },
      createdBy: userId,
      updatedBy: userId,
    });
    const aboutus = await newAboutus.save();
    return successResponse(res, 201, 'Aboutus created successfully', aboutus);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getAllAboutus = async (req, res) => {
  try {
    const aboutus = await Aboutus.find({})
      .populate(['createdBy', 'updatedBy'])
      .sort({ updatedAt: 'desc' });
    return successResponse(res, 200, 'Aboutus retrieved successfully', aboutus);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getActiveAboutus = async (req, res) => {
  try {
    const aboutus = await Aboutus.find({
      isActive: true,
    }).sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'Aboutus retrieved successfully',
      aboutus[0]
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSpecificAboutus = async (req, res) => {
  try {
    const { itemId } = req.params;
    const aboutusFound = await Aboutus.findOne({ _id: itemId }).populate([
      'createdBy',
      'updatedBy',
    ]);
    if (!aboutusFound) {
      return errorResponse(res, 404, 'Aboutus not found');
    }
    return successResponse(
      res,
      200,
      'Aboutus retrieved successfully',
      aboutusFound
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateAboutus = async (req, res) => {
  try {
    const { itemId } = req.params;
    const aboutusFound = await Aboutus.findOne({ _id: itemId });
    if (!aboutusFound) {
      return errorResponse(res, 404, 'Aboutus not found');
    }
    const {
      enName,
      frName,
      rwName,
      enDescription,
      frDescription,
      rwDescription,
      enVision,
      frVision,
      rwVision,
      enMission,
      frMission,
      rwMission,
      enObjectives,
      frObjectives,
      rwObjectives,
    } = req.body;
    const userId = req.tokenData._id;
    const aboutus = await Aboutus.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          name: { en: enName, fr: frName, rw: rwName },
          description: {
            en: enDescription,
            fr: frDescription,
            rw: rwDescription,
          },
          vision: { en: enVision, fr: frVision, rw: rwVision },
          mission: { en: enMission, fr: frMission, rw: rwMission },
          objectives: { en: enObjectives, fr: frObjectives, rw: rwObjectives },
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(res, 200, 'Aboutus edited successfully', aboutus);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deleteAboutus = async (req, res) => {
  try {
    const { itemId } = req.params;
    const aboutusFound = await Aboutus.findOne({ _id: itemId });
    if (!aboutusFound) {
      return errorResponse(res, 404, 'Aboutus not found');
    }
    await Aboutus.deleteOne({ _id: itemId });
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const activateAboutus = async (req, res) => {
  try {
    const { itemId } = req.params;
    const aboutusFound = await Aboutus.findOne({ _id: itemId });
    if (!aboutusFound) {
      return errorResponse(res, 404, 'Aboutus not found');
    }
    const userId = req.tokenData._id;
    const aboutus = await Aboutus.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: true,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(res, 200, 'Aboutus edited successfully', aboutus);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const archiveAboutus = async (req, res) => {
  try {
    const { itemId } = req.params;
    const aboutusFound = await Aboutus.findOne({ _id: itemId });
    if (!aboutusFound) {
      return errorResponse(res, 404, 'Aboutus not found');
    }
    const userId = req.tokenData._id;
    const aboutus = await Aboutus.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: !aboutusFound.isActive,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(res, 200, 'Aboutus edited successfully', aboutus);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
