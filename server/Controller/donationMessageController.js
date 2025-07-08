import { errorResponse, successResponse } from '../Helpers/responses.js';
import DonationMessage from '../Models/DonationMessage.js';

export const createDonationMessage = async (req, res) => {
  try {
    const { enDescription, frDescription, rwDescription } = req.body;
    const userId = req.tokenData._id;
    const newDonationMessage = new DonationMessage({
      description: {
        en: enDescription,
        fr: frDescription,
        rw: rwDescription,
      },
      createdBy: userId,
      updatedBy: userId,
    });
    const donationMessage = await newDonationMessage.save();
    return successResponse(
      res,
      201,
      'DonationMessage created successfully',
      donationMessage
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getAllMoreOnUs = async (req, res) => {
  try {
    const donationMessage = await DonationMessage.find({})
      .populate(['createdBy', 'updatedBy'])
      .sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'All donationMessage retrieved successfully',
      donationMessage
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getactiveDonationMessage = async (req, res) => {
  try {
    const donationMessage = await DonationMessage.find({
      isActive: true,
    })
      .sort({ updatedAt: 'desc' })
      .limit(1);
    return successResponse(
      res,
      200,
      'DonationMessage retrieved successfully',
      donationMessage[0]
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSpecificDonationMessage = async (req, res) => {
  try {
    const { itemId } = req.params;
    const donationMessageFound = await DonationMessage.findOne({
      _id: itemId,
    }).populate(['createdBy', 'updatedBy']);
    if (!donationMessageFound) {
      return errorResponse(res, 404, 'DonationMessage not found');
    }
    return successResponse(
      res,
      200,
      'DonationMessage retrieved successfully',
      donationMessageFound
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateDonationMessage = async (req, res) => {
  try {
    const { itemId } = req.params;
    const donationMessageFound = await DonationMessage.findOne({ _id: itemId });
    if (!donationMessageFound) {
      return errorResponse(res, 404, 'DonationMessage not found');
    }
    const { enDescription, frDescription, rwDescription } = req.body;
    const userId = req.tokenData._id;
    const donationMessage = await DonationMessage.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          description: {
            en: enDescription,
            fr: frDescription,
            rw: rwDescription,
          },
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(
      res,
      200,
      'DonationMessage edited successfully',
      donationMessage
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deleteDonationMessage = async (req, res) => {
  try {
    const { itemId } = req.params;
    const donationMessageFound = await DonationMessage.findOne({ _id: itemId });
    if (!donationMessageFound) {
      return errorResponse(res, 404, 'DonationMessage not found');
    }
    await DonationMessage.deleteOne({ _id: itemId });
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const activateDonationMessage = async (req, res) => {
  try {
    const { itemId } = req.params;
    const donationMessageFound = await DonationMessage.findOne({ _id: itemId });
    if (!donationMessageFound) {
      return errorResponse(res, 404, 'DonationMessage not found');
    }
    const userId = req.tokenData._id;
    const donationMessage = await DonationMessage.findOneAndUpdate(
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
      'DonationMessage edited successfully',
      donationMessage
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const archiveDonationMessage = async (req, res) => {
  try {
    const { itemId } = req.params;
    const donationMessageFound = await DonationMessage.findOne({ _id: itemId });
    if (!donationMessageFound) {
      return errorResponse(res, 404, 'DonationMessage not found');
    }
    const userId = req.tokenData._id;
    const donationMessage = await DonationMessage.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: !donationMessageFound.isActive,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(
      res,
      200,
      'DonationMessage edited successfully',
      donationMessage
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
