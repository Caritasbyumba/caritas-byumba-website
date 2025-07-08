import fs from 'fs';
import findBestMatch from '../Helpers/findBestMatch.js';
import { errorResponse, successResponse } from '../Helpers/responses.js';
import Advert from '../Models/Advert.js';
import AdvertsIntro from '../Models/AdvertsIntro.js';

export const createAdvert = async (req, res) => {
  try {
    const {
      enName,
      frName,
      rwName,
      enDescription,
      frDescription,
      rwDescription,
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
    const newAdvert = new Advert({
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
      gallery: images,
      imageDescriptions: updatedImageDescriptions,
      createdBy: userId,
      updatedBy: userId,
    });
    const advert = await newAdvert.save();
    return successResponse(res, 201, 'Advert created successfully', advert);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getAllAdverts = async (req, res) => {
  try {
    const adverts = await Advert.find({})
      .populate(['createdBy', 'updatedBy'])
      .sort({ updatedAt: 'desc' });
    return successResponse(res, 200, 'Adverts retrieved successfully', adverts);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getActiveAdverts = async (req, res) => {
  try {
    const adverts = await Advert.find({
      isActive: true,
    }).sort({ updatedAt: 'desc' });
    return successResponse(res, 200, 'Adverts retrieved successfully', adverts);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSpecificAdvert = async (req, res) => {
  try {
    const { itemId } = req.params;
    const advertFound = await Advert.findOne({ _id: itemId }).populate([
      'createdBy',
      'updatedBy',
    ]);
    if (!advertFound) {
      return errorResponse(res, 404, 'Advert not found');
    }
    return successResponse(
      res,
      200,
      'Advert retrieved successfully',
      advertFound
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateAdvert = async (req, res) => {
  try {
    const { itemId } = req.params;
    const advertFound = await Advert.findOne({ _id: itemId });
    if (!advertFound) {
      return errorResponse(res, 404, 'Advert not found');
    }
    const {
      enName,
      frName,
      rwName,
      enDescription,
      frDescription,
      rwDescription,
      imageDescriptions,
    } = req.body;
    const userId = req.tokenData._id;
    let images = [];
    let updatedImageDescriptions = [];
    let advert;
    if (req.files && req.files.length > 0) {
      req.files.forEach((image) => {
        images.push(image.filename);
      });
      advertFound.gallery.forEach((image) => {
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
      advert = await Advert.findOneAndUpdate(
        { _id: itemId },
        {
          $set: {
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
            gallery: images,
            imageDescriptions: updatedImageDescriptions,
            updatedBy: userId,
          },
        },
        { new: true }
      ).populate(['createdBy', 'updatedBy']);
    } else {
      advert = await Advert.findOneAndUpdate(
        { _id: itemId },
        {
          $set: {
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
            updatedBy: userId,
          },
        },
        { new: true }
      ).populate(['createdBy', 'updatedBy']);
    }
    return successResponse(res, 200, 'Advert edieted successfully', advert);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deleteAdvert = async (req, res) => {
  try {
    const { itemId } = req.params;
    const advertFound = await Advert.findOne({ _id: itemId });
    if (!advertFound) {
      return errorResponse(res, 404, 'Advert not found');
    }
    await Advert.deleteOne({ _id: itemId });
    advertFound.gallery.forEach((image) => {
      fs.unlinkSync(`public/images/${image}`);
    });
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const activateAdvert = async (req, res) => {
  try {
    const { itemId } = req.params;
    const advertFound = await Advert.findOne({ _id: itemId });
    if (!advertFound) {
      return errorResponse(res, 404, 'Advert not found');
    }
    const userId = req.tokenData._id;
    const advert = await Advert.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: true,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(res, 200, 'Advert edited successfully', advert);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const archiveAdvert = async (req, res) => {
  try {
    const { itemId } = req.params;
    const advertFound = await Advert.findOne({ _id: itemId });
    if (!advertFound) {
      return errorResponse(res, 404, 'advert not found');
    }
    const userId = req.tokenData._id;
    const advert = await Advert.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: !advertFound.isActive,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(res, 200, 'Advert edited successfully', advert);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const createAdvertsIntro = async (req, res) => {
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
    const newAdvertsIntro = new AdvertsIntro({
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
    const advertsIntro = await newAdvertsIntro.save();
    return successResponse(
      res,
      201,
      'AdvertsIntro created successfully',
      advertsIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getAllAdvertsIntros = async (req, res) => {
  try {
    const advertsIntros = await AdvertsIntro.find({})
      .populate(['createdBy', 'updatedBy'])
      .sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'AdvertsIntros retrieved successfully',
      advertsIntros
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getActiveAdvertsIntros = async (req, res) => {
  try {
    const advertsIntros = await AdvertsIntro.find({
      isActive: true,
    }).sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'AdvertsIntros retrieved successfully',
      advertsIntros[0]
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSpecificAdvertsIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const advertsIntroFound = await AdvertsIntro.findOne({
      _id: itemId,
    }).populate(['createdBy', 'updatedBy']);
    if (!advertsIntroFound) {
      return errorResponse(res, 404, 'AdvertsIntro not found');
    }
    return successResponse(
      res,
      200,
      'AdvertsIntro retrieved successfully',
      advertsIntroFound
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateAdvertsIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const advertsIntroFound = await AdvertsIntro.findOne({ _id: itemId });
    if (!advertsIntroFound) {
      return errorResponse(res, 404, 'AdvertsIntro not found');
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
    const advertsIntro = await AdvertsIntro.findOneAndUpdate(
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
      'AdvertsIntro edieted successfully',
      advertsIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deleteAdvertsIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const advertsIntroFound = await AdvertsIntro.findOne({ _id: itemId });
    if (!advertsIntroFound) {
      return errorResponse(res, 404, 'AdvertsIntro not found');
    }
    await AdvertsIntro.deleteOne({ _id: itemId });
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const activateAdvertsIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const advertsIntroFound = await AdvertsIntro.findOne({ _id: itemId });
    if (!advertsIntroFound) {
      return errorResponse(res, 404, 'AdvertsIntro not found');
    }
    const userId = req.tokenData._id;
    const advertsIntro = await AdvertsIntro.findOneAndUpdate(
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
      'AdvertsIntro edited successfully',
      advertsIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const archiveAdvertsIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const advertsIntroFound = await AdvertsIntro.findOne({ _id: itemId });
    if (!advertsIntroFound) {
      return errorResponse(res, 404, 'advertsIntro not found');
    }
    const userId = req.tokenData._id;
    const advertsIntro = await AdvertsIntro.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: !advertsIntroFound.isActive,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(
      res,
      200,
      'AdvertsIntro edited successfully',
      advertsIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
