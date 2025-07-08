import { errorResponse, successResponse } from '../Helpers/responses.js';
import FooterLink from '../Models/FooterLink.js';

export const createFooterLink = async (req, res) => {
  try {
    const { name, link } = req.body;
    const userId = req.tokenData._id;
    const newFooterLink = new FooterLink({
      name: { en: name.en, fr: name.fr, rw: name.rw },
      link: link,
      createdBy: userId,
      updatedBy: userId,
    });
    const footerLink = await newFooterLink.save();
    return successResponse(
      res,
      201,
      'Footer Link created successfully',
      footerLink
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getAllFooterLinks = async (req, res) => {
  try {
    const footerlinks = await FooterLink.find({}).sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'Footer links retrieved successfully',
      footerlinks
    ).populate(['createdBy', 'updatedBy']);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getActiveFooterLinks = async (req, res) => {
  try {
    const footerLinks = await FooterLink.find({
      isActive: true,
    }).sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'Footer links retrieved successfully',
      footerLinks
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSpecificFooterLink = async (req, res) => {
  try {
    const { itemId } = req.params;
    const FooterLinkFound = await FooterLink.findOne({ _id: itemId }).populate([
      'createdBy',
      'updatedBy',
    ]);
    if (!FooterLinkFound) {
      return errorResponse(res, 404, 'Footer link not found');
    }
    return successResponse(
      res,
      200,
      'Footer link retrieved successfully',
      FooterLinkFound
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateFooterLink = async (req, res) => {
  try {
    const { itemId } = req.params;
    const footerLinkFound = await FooterLink.findOne({ _id: itemId });
    if (!footerLinkFound) {
      return errorResponse(res, 404, 'Footer link not found');
    }
    const { name, link } = req.body;
    const userId = req.tokenData._id;
    const footerLink = await FooterLink.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          name: { en: name.en, fr: name.fr, rw: name.rw },
          link: link,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(
      res,
      200,
      'Footer link edited successfully',
      footerLink
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deleteFooterLink = async (req, res) => {
  try {
    const { itemId } = req.params;
    const footerLinkFound = await FooterLink.findOne({ _id: itemId });
    if (!footerLinkFound) {
      return errorResponse(res, 404, 'Footer link not found');
    }
    await FooterLink.deleteOne({ _id: itemId });
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const activateFooterLink = async (req, res) => {
  try {
    const { itemId } = req.params;
    const footerLinkFound = await FooterLink.findOne({ _id: itemId });
    if (!footerLinkFound) {
      return errorResponse(res, 404, 'Footer link not found');
    }
    const userId = req.tokenData._id;
    const footerLink = await FooterLink.findOneAndUpdate(
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
      'Footer link edited successfully',
      footerLink
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const archiveFooterLink = async (req, res) => {
  try {
    const { itemId } = req.params;
    const footerLinkFound = await FooterLink.findOne({ _id: itemId });
    if (!footerLinkFound) {
      return errorResponse(res, 404, 'Footer link not found');
    }
    const userId = req.tokenData._id;
    const footerLink = await FooterLink.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: false,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(
      res,
      200,
      'Footer link edited successfully',
      footerLink
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
