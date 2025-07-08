import fs from 'fs';
import { errorResponse, successResponse } from '../Helpers/responses.js';
import Partner from '../Models/Partner.js';
import PartnersIntro from '../Models/PartnersIntro.js';

export const createPartner = async (req, res) => {
  try {
    const {
      name,
      enDescription,
      frDescription,
      rwDescription,
      enQuote,
      frQuote,
      rwQuote,
    } = req.body;
    const userId = req.tokenData._id;
    const newPartner = new Partner({
      name: name,
      quote: {
        en: enQuote,
        fr: frQuote,
        rw: rwQuote,
      },
      description: {
        en: enDescription,
        fr: frDescription,
        rw: rwDescription,
      },
      image: req.file.filename,
      createdBy: userId,
      updatedBy: userId,
    });
    const partner = await newPartner.save();
    return successResponse(res, 201, 'Partner created successfully', partner);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find({})
      .populate(['createdBy', 'updatedBy'])
      .sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'Partners retrieved successfully',
      partners
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getActivePartners = async (req, res) => {
  try {
    const partners = await Partner.find({
      isActive: true,
    }).sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'Partners retrieved successfully',
      partners
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSpecificPartner = async (req, res) => {
  try {
    const { itemId } = req.params;
    const partnerFound = await Partner.findOne({ _id: itemId }).populate([
      'createdBy',
      'updatedBy',
    ]);
    if (!partnerFound) {
      return errorResponse(res, 404, 'Partner not found');
    }
    return successResponse(
      res,
      200,
      'Partner retrieved successfully',
      partnerFound
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updatePartner = async (req, res) => {
  try {
    const { itemId } = req.params;
    const partnerFound = await Partner.findOne({ _id: itemId });
    if (!partnerFound) {
      return errorResponse(res, 404, 'Partner not found');
    }
    const {
      name,
      enQuote,
      frQuote,
      rwQuote,
      enDescription,
      frDescription,
      rwDescription,
    } = req.body;
    const userId = req.tokenData._id;
    let partner;
    if (req.file?.filename) {
      fs.unlinkSync(`public/images/${partnerFound.image}`);

      partner = await Partner.findOneAndUpdate(
        { _id: itemId },
        {
          $set: {
            name: name,
            quote: {
              en: enQuote,
              fr: frQuote,
              rw: rwQuote,
            },
            description: {
              en: enDescription,
              fr: frDescription,
              rw: rwDescription,
            },
            image: req.file.filename,
            updatedBy: userId,
          },
        },
        { new: true }
      ).populate(['createdBy', 'updatedBy']);
    } else {
      partner = await Partner.findOneAndUpdate(
        { _id: itemId },
        {
          $set: {
            name: name,
            quote: {
              en: enQuote,
              fr: frQuote,
              rw: rwQuote,
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
    }
    return successResponse(res, 200, 'Partner edieted successfully', partner);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deletePartner = async (req, res) => {
  try {
    const { itemId } = req.params;
    const partnerFound = await Partner.findOne({ _id: itemId });
    if (!partnerFound) {
      return errorResponse(res, 404, 'Partner not found');
    }
    await Partner.deleteOne({ _id: itemId });
    fs.unlinkSync(`public/images/${partnerFound.image}`);
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const activatePartner = async (req, res) => {
  try {
    const { itemId } = req.params;
    const partnerFound = await Partner.findOne({ _id: itemId });
    if (!partnerFound) {
      return errorResponse(res, 404, 'Partner not found');
    }
    const userId = req.tokenData._id;
    const partner = await Partner.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: true,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(res, 200, 'Partner edited successfully', partner);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const archivePartner = async (req, res) => {
  try {
    const { itemId } = req.params;
    const partnerFound = await Partner.findOne({ _id: itemId });
    if (!partnerFound) {
      return errorResponse(res, 404, 'Partner not found');
    }
    const userId = req.tokenData._id;
    const partner = await Partner.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: !partnerFound.isActive,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(res, 200, 'Partner edited successfully', partner);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const createPartnersIntro = async (req, res) => {
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
    const newPartnersIntro = new PartnersIntro({
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
    const partnersIntro = await newPartnersIntro.save();
    return successResponse(
      res,
      201,
      'PartnersIntro created successfully',
      partnersIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getAllPartnersIntros = async (req, res) => {
  try {
    const partnersIntros = await PartnersIntro.find({})
      .populate(['createdBy', 'updatedBy'])
      .sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'PartnersIntros retrieved successfully',
      partnersIntros
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getActivePartnersIntros = async (req, res) => {
  try {
    const partnersIntros = await PartnersIntro.find({
      isActive: true,
    }).sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'PartnersIntros retrieved successfully',
      partnersIntros[0]
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSpecificPartnersIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const partnersIntroFound = await PartnersIntro.findOne({
      _id: itemId,
    }).populate(['createdBy', 'updatedBy']);
    if (!partnersIntroFound) {
      return errorResponse(res, 404, 'PartnersIntro not found');
    }
    return successResponse(
      res,
      200,
      'PartnersIntro retrieved successfully',
      partnersIntroFound
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updatePartnersIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const partnersIntroFound = await PartnersIntro.findOne({ _id: itemId });
    if (!partnersIntroFound) {
      return errorResponse(res, 404, 'PartnersIntro not found');
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
    const partnersIntro = await PartnersIntro.findOneAndUpdate(
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
      'PartnersIntro edieted successfully',
      partnersIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deletePartnersIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const partnersIntroFound = await PartnersIntro.findOne({ _id: itemId });
    if (!partnersIntroFound) {
      return errorResponse(res, 404, 'PartnersIntro not found');
    }
    await PartnersIntro.deleteOne({ _id: itemId });
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const activatePartnersIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const partnersIntroFound = await PartnersIntro.findOne({ _id: itemId });
    if (!partnersIntroFound) {
      return errorResponse(res, 404, 'PartnersIntro not found');
    }
    const userId = req.tokenData._id;
    const partnersIntro = await PartnersIntro.findOneAndUpdate(
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
      'PartnersIntro edited successfully',
      partnersIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const archivePartnersIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const partnersIntroFound = await PartnersIntro.findOne({ _id: itemId });
    if (!partnersIntroFound) {
      return errorResponse(res, 404, 'PartnersIntro not found');
    }
    const userId = req.tokenData._id;
    const partnersIntro = await PartnersIntro.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: !partnersIntroFound.isActive,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(
      res,
      200,
      'PartnersIntro edited successfully',
      partnersIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
