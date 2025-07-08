import fs from 'fs';
import findBestMatch from '../Helpers/findBestMatch.js';
import { errorResponse, successResponse } from '../Helpers/responses.js';
import Publication from '../Models/Publication.js';
import PublicationsIntro from '../Models/PublicationsIntro.js';

export const createPublication = async (req, res) => {
  try {
    const {
      enTitle,
      frTitle,
      rwTitle,
      enDescription,
      frDescription,
      rwDescription,
      tags,
      imageDescriptions,
    } = req.body;
    const userId = req.tokenData._id;
    let images = [];
    let updatedImageDescriptions = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((image) => {
        images.push(image.filename);
      });
    }
    if (JSON.parse(imageDescriptions).length > 0) {
      updatedImageDescriptions = JSON.parse(imageDescriptions).map(
        (imageDesc) => {
          return { ...imageDesc, name: findBestMatch(imageDesc.name, images) };
        }
      );
    }
    const newPublication = new Publication({
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
      tags: JSON.parse(tags),
      gallery: images,
      imageDescriptions: updatedImageDescriptions,
      createdBy: userId,
      updatedBy: userId,
    });
    const publication = await newPublication.save();
    return successResponse(
      res,
      201,
      'Publication created successfully',
      publication
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getAllPublications = async (req, res) => {
  try {
    const publications = await Publication.find({})
      .populate(['createdBy', 'updatedBy'])
      .sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'Publications retrieved successfully',
      publications
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getActivePublications = async (req, res) => {
  try {
    const publications = await Publication.find({
      isActive: true,
    }).sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'Publications retrieved successfully',
      publications
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSpecificPublication = async (req, res) => {
  try {
    const { itemId } = req.params;
    const publicationFound = await Publication.findOne({
      _id: itemId,
    }).populate(['createdBy', 'updatedBy']);
    if (!publicationFound) {
      return errorResponse(res, 404, 'Publication not found');
    }
    return successResponse(
      res,
      200,
      'Publication retrieved successfully',
      publicationFound
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updatePublication = async (req, res) => {
  try {
    const { itemId } = req.params;
    const publicationFound = await Publication.findOne({ _id: itemId });
    if (!publicationFound) {
      return errorResponse(res, 404, 'Publication not found');
    }
    const {
      enTitle,
      frTitle,
      rwTitle,
      enDescription,
      frDescription,
      rwDescription,
      tags,
      imageDescriptions,
    } = req.body;
    const userId = req.tokenData._id;
    let images = [];
    let updatedImageDescriptions = [];
    let publication;
    if (req.files && req.files.length > 0) {
      req.files.forEach((image) => {
        images.push(image.filename);
      });
      publicationFound.gallery.forEach((image) => {
        fs.unlinkSync(`public/images/${image}`);
      });
      if (JSON.parse(imageDescriptions).length > 0) {
        updatedImageDescriptions = JSON.parse(imageDescriptions).map(
          (imageDesc) => {
            return {
              ...imageDesc,
              name: findBestMatch(imageDesc.name, images),
            };
          }
        );
      }

      publication = await Publication.findOneAndUpdate(
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
            tags: JSON.parse(tags),
            gallery: images,
            imageDescriptions: updatedImageDescriptions,
            updatedBy: userId,
          },
        },
        { new: true }
      ).populate(['createdBy', 'updatedBy']);
    } else {
      publication = await Publication.findOneAndUpdate(
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
            tags: JSON.parse(tags),
            updatedBy: userId,
          },
        },
        { new: true }
      ).populate(['createdBy', 'updatedBy']);
    }
    return successResponse(
      res,
      200,
      'Publication edieted successfully',
      publication
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deletePublication = async (req, res) => {
  try {
    const { itemId } = req.params;
    const publicationFound = await Publication.findOne({ _id: itemId });
    if (!publicationFound) {
      return errorResponse(res, 404, 'Publication not found');
    }
    await Publication.deleteOne({ _id: itemId });
    publicationFound.gallery.forEach((image) => {
      fs.unlinkSync(`public/images/${image}`);
    });
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const activatePublication = async (req, res) => {
  try {
    const { itemId } = req.params;
    const publicationFound = await Publication.findOne({ _id: itemId });
    if (!publicationFound) {
      return errorResponse(res, 404, 'Publication not found');
    }
    const userId = req.tokenData._id;
    const publication = await Publication.findOneAndUpdate(
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
      'Publication edited successfully',
      publication
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const archivePublication = async (req, res) => {
  try {
    const { itemId } = req.params;
    const publicationFound = await Publication.findOne({ _id: itemId });
    if (!publicationFound) {
      return errorResponse(res, 404, 'Publication not found');
    }
    const userId = req.tokenData._id;
    const publication = await Publication.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: !publicationFound.isActive,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(
      res,
      200,
      'Publication edited successfully',
      publication
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const createPublicationsIntro = async (req, res) => {
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
    const newPublicationsIntro = new PublicationsIntro({
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
    const publicationsIntro = await newPublicationsIntro.save();
    return successResponse(
      res,
      201,
      'PublicationsIntro created successfully',
      publicationsIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getAllPublicationsIntros = async (req, res) => {
  try {
    const publicationsIntros = await PublicationsIntro.find({})
      .populate(['createdBy', 'updatedBy'])
      .sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'PublicationsIntros retrieved successfully',
      publicationsIntros
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getActivePublicationsIntros = async (req, res) => {
  try {
    const publicationsIntros = await PublicationsIntro.find({
      isActive: true,
    }).sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'PublicationsIntros retrieved successfully',
      publicationsIntros[0]
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSpecificPublicationsIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const publicationsIntroFound = await PublicationsIntro.findOne({
      _id: itemId,
    }).populate(['createdBy', 'updatedBy']);
    if (!publicationsIntroFound) {
      return errorResponse(res, 404, 'PublicationsIntro not found');
    }
    return successResponse(
      res,
      200,
      'PublicationsIntro retrieved successfully',
      publicationsIntroFound
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updatePublicationsIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const publicationsIntroFound = await PublicationsIntro.findOne({
      _id: itemId,
    });
    if (!publicationsIntroFound) {
      return errorResponse(res, 404, 'PublicationsIntro not found');
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
    const publicationsIntro = await PublicationsIntro.findOneAndUpdate(
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
      'PublicationsIntro edieted successfully',
      publicationsIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deletePublicationsIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const publicationsIntroFound = await PublicationsIntro.findOne({
      _id: itemId,
    });
    if (!publicationsIntroFound) {
      return errorResponse(res, 404, 'PublicationsIntro not found');
    }
    await PublicationsIntro.deleteOne({ _id: itemId });
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const activatePublicationsIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const publicationsIntroFound = await PublicationsIntro.findOne({
      _id: itemId,
    });
    if (!publicationsIntroFound) {
      return errorResponse(res, 404, 'PublicationsIntro not found');
    }
    const userId = req.tokenData._id;
    const publicationsIntro = await PublicationsIntro.findOneAndUpdate(
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
      'PublicationsIntro edited successfully',
      publicationsIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const archivePublicationsIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const publicationsIntroFound = await PublicationsIntro.findOne({
      _id: itemId,
    });
    if (!publicationsIntroFound) {
      return errorResponse(res, 404, 'PublicationsIntro not found');
    }
    const userId = req.tokenData._id;
    const publicationsIntro = await PublicationsIntro.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: !publicationsIntroFound.isActive,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(
      res,
      200,
      'PublicationsIntro edited successfully',
      publicationsIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
