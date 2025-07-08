import DonateIntro from '../Models/DonateIntro.js';
import { errorResponse, successResponse } from '../Helpers/responses.js';
import DonationArea from '../Models/DonationArea.js';

export const createDonateIntro = async (req, res) => {
  try {
    const {
      enTitle,
      frTitle,
      rwTitle,
      enDescription,
      frDescription,
      rwDescription,
    } = req.body;
    const userId = req.tokenData._id;
    const newDonateIntro = new DonateIntro({
      title: {
        en: enTitle,
        fr: frTitle,
        rw: rwTitle,
      },
      description: {
        en: enDescription,
        fr: frDescription,
        rw: rwDescription,
      },
      createdBy: userId,
      updatedBy: userId,
    });
    const donateIntro = await newDonateIntro.save();
    return successResponse(
      res,
      201,
      'DonateIntro created successfully',
      donateIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getAllDonateIntros = async (req, res) => {
  try {
    const donateIntros = await DonateIntro.find({})
      .populate(['createdBy', 'updatedBy'])
      .sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'DonateIntros retrieved successfully',
      donateIntros
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getActiveDonateIntros = async (req, res) => {
  try {
    const donateIntros = await DonateIntro.find({
      isActive: true,
    }).sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'DonateIntros retrieved successfully',
      donateIntros[0]
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSpecificDonateIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const donateIntroFound = await DonateIntro.findOne({
      _id: itemId,
    }).populate(['createdBy', 'updatedBy']);
    if (!donateIntroFound) {
      return errorResponse(res, 404, 'DonateIntro not found');
    }
    return successResponse(
      res,
      200,
      'DonateIntro retrieved successfully',
      donateIntroFound
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateDonateIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const donateIntroFound = await DonateIntro.findOne({ _id: itemId });
    if (!donateIntroFound) {
      return errorResponse(res, 404, 'DonateIntro not found');
    }
    const {
      enTitle,
      frTitle,
      rwTitle,
      enDescription,
      frDescription,
      rwDescription,
    } = req.body;
    const userId = req.tokenData._id;
    const donateIntro = await DonateIntro.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          title: {
            en: enTitle,
            fr: frTitle,
            rw: rwTitle,
          },
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
      'DonateIntro edieted successfully',
      donateIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deleteDonateIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const donateIntroFound = await DonateIntro.findOne({ _id: itemId });
    if (!donateIntroFound) {
      return errorResponse(res, 404, 'DonateIntro not found');
    }
    await DonateIntro.deleteOne({ _id: itemId });
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const activateDonateIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const donateIntroFound = await DonateIntro.findOne({ _id: itemId });
    if (!donateIntroFound) {
      return errorResponse(res, 404, 'DonateIntro not found');
    }
    const userId = req.tokenData._id;
    const donateIntro = await DonateIntro.findOneAndUpdate(
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
      'DonateIntro edited successfully',
      donateIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const archiveDonateIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const donateIntroFound = await DonateIntro.findOne({ _id: itemId });
    if (!donateIntroFound) {
      return errorResponse(res, 404, 'DonateIntro not found');
    }
    const userId = req.tokenData._id;
    const donateIntro = await DonateIntro.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: !donateIntroFound.isActive,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(
      res,
      200,
      'DonateIntro edited successfully',
      donateIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const createDonationArea = async (req, res) => {
  try {
    const {
      enName,
      frName,
      rwName,
      enDescription,
      frDescription,
      rwDescription,
      projects,
    } = req.body;
    const userId = req.tokenData._id;
    const newDonationArea = new DonationArea({
      name: {
        en: enName,
        fr: frName,
        rw: rwName,
      },
      description: {
        en: enDescription,
        fr: frDescription,
        rw: rwDescription,
      },
      projects: projects,
      createdBy: userId,
      updatedBy: userId,
    });
    const donationArea = await newDonationArea.save();
    return successResponse(
      res,
      201,
      'DonationArea created successfully',
      donationArea
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getAllDonationAreas = async (req, res) => {
  try {
    const donationAreas = await DonationArea.find({})
      .populate(['projects', 'createdBy', 'updatedBy'])
      .sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'DonationAreas retrieved successfully',
      donationAreas
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getActiveDonationAreas = async (req, res) => {
  try {
    const donationAreas = await DonationArea.find({
      isActive: true,
    }).populate(['projects']);
    return successResponse(
      res,
      200,
      'DonationAreas retrieved successfully',
      donationAreas
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSpecificDonationArea = async (req, res) => {
  try {
    const { itemId } = req.params;
    const donationAreaFound = await DonationArea.findOne({
      _id: itemId,
    }).populate(['projects', 'createdBy', 'updatedBy']);
    if (!donationAreaFound) {
      return errorResponse(res, 404, 'DonationArea not found');
    }
    return successResponse(
      res,
      200,
      'DonationArea retrieved successfully',
      donationAreaFound
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateDonationArea = async (req, res) => {
  try {
    const { itemId } = req.params;
    const donationAreaFound = await DonationArea.findOne({ _id: itemId });
    if (!donationAreaFound) {
      return errorResponse(res, 404, 'DonationArea not found');
    }
    const {
      enName,
      frName,
      rwName,
      enDescription,
      frDescription,
      rwDescription,
      projects,
    } = req.body;
    const userId = req.tokenData._id;
    const donationArea = await DonationArea.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          Name: {
            en: enName,
            fr: frName,
            rw: rwName,
          },
          description: {
            en: enDescription,
            fr: frDescription,
            rw: rwDescription,
          },
          projects: projects,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(
      res,
      200,
      'DonationArea edieted successfully',
      donationArea
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deleteDonationArea = async (req, res) => {
  try {
    const { itemId } = req.params;
    const donationAreaFound = await DonationArea.findOne({ _id: itemId });
    if (!donationAreaFound) {
      return errorResponse(res, 404, 'DonationArea not found');
    }
    await DonationArea.deleteOne({ _id: itemId });
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const activateDonationArea = async (req, res) => {
  try {
    const { itemId } = req.params;
    const donationAreaFound = await DonationArea.findOne({ _id: itemId });
    if (!donationAreaFound) {
      return errorResponse(res, 404, 'DonationArea not found');
    }
    const userId = req.tokenData._id;
    const donationArea = await DonationArea.findOneAndUpdate(
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
      'DonationArea edited successfully',
      donationArea
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const archiveDonationArea = async (req, res) => {
  try {
    const { itemId } = req.params;
    const donationAreaFound = await DonationArea.findOne({ _id: itemId });
    if (!donationAreaFound) {
      return errorResponse(res, 404, 'DonationArea not found');
    }
    const userId = req.tokenData._id;
    const donationArea = await DonationArea.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: !donationAreaFound.isActive,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(
      res,
      200,
      'DonationArea edited successfully',
      donationArea
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
