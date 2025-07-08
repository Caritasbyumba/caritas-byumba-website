import fs from 'fs';
import path from 'path';

import { errorResponse, successResponse } from '../Helpers/responses.js';
import Carousel from '../Models/Carousel.js';

// Helper function for file deletion with error handling
const deleteFileSafe = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (fileError) {
    console.error('Error deleting file:', fileError);
  }
};

export const createCarousel = async (req, res) => {
  let savedFile = null;
  try {
    // Validate required fields
    if (!req.file) {
      return errorResponse(res, 400, 'Image file is required');
    }

    const {
      enTitle,
      frTitle,
      rwTitle,
      enDescription,
      frDescription,
      rwDescription,
    } = req.body;

    if (!enTitle || !frTitle || !rwTitle) {
      deleteFileSafe(path.join('public', 'images', req.file.filename));
      return errorResponse(res, 400, 'All title translations are required');
    }

    const userId = req.tokenData._id;
    savedFile = req.file.filename;

    const newCarousel = new Carousel({
      title: { en: enTitle, fr: frTitle, rw: rwTitle },
      description: {
        en: enDescription,
        fr: frDescription,
        rw: rwDescription,
      },
      image: savedFile,
      createdBy: userId,
      updatedBy: userId,
    });

    const carousel = await newCarousel.save();
    return successResponse(res, 201, 'Carousel created successfully', carousel);
  } catch (error) {
    console.error('Error in createCarousel:', error);
    if (savedFile) {
      deleteFileSafe(path.join('public', 'images', savedFile));
    }
    return errorResponse(
      res,
      500,
      'Failed to create carousel',
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
};

export const getAllCarousels = async (req, res) => {
  try {
    const carousels = await Carousel.find({})
      .populate(['createdBy', 'updatedBy'])
      .sort({ updatedAt: 'desc' })
      .lean()
      .exec();

    if (!carousels.length) {
      return successResponse(res, 200, 'No carousels found', []);
    }

    return successResponse(
      res,
      200,
      'Carousels retrieved successfully',
      carousels
    );
  } catch (error) {
    console.error('Error in getAllCarousels:', error);
    return errorResponse(
      res,
      500,
      'Failed to retrieve carousels',
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
};

export const getActiveCarousels = async (req, res) => {
  try {
    const carousels = await Carousel.find({ isActive: true })
      .sort({ updatedAt: 'desc' })
      .lean()
      .exec();

    if (!carousels.length) {
      return successResponse(res, 200, 'No active carousels found', []);
    }

    return successResponse(
      res,
      200,
      'Active carousels retrieved successfully',
      carousels
    );
  } catch (error) {
    console.error('Error in getActiveCarousels:', error);
    return errorResponse(
      res,
      500,
      'Failed to retrieve active carousels',
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
};

export const getSpecificCarousel = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return errorResponse(res, 400, 'Invalid carousel ID');
    }

    const carouselFound = await Carousel.findOne({ _id: itemId })
      .populate(['createdBy', 'updatedBy'])
      .lean()
      .exec();

    if (!carouselFound) {
      return errorResponse(res, 404, 'Carousel not found');
    }

    return successResponse(
      res,
      200,
      'Carousel retrieved successfully',
      carouselFound
    );
  } catch (error) {
    console.error('Error in getSpecificCarousel:', error);
    return errorResponse(
      res,
      500,
      'Failed to retrieve carousel',
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
};

// ... (similar improvements for updateCarousel, deleteCarousel, activateCarousel, archiveCarousel)

export const updateCarousel = async (req, res) => {
  let newFile = null;
  try {
    const { itemId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return errorResponse(res, 400, 'Invalid carousel ID');
    }

    const carouselFound = await Carousel.findOne({ _id: itemId });
    if (!carouselFound) {
      return errorResponse(res, 404, 'Carousel not found');
    }

    const {
      enTitle,
      frTitle,
      rwTitle,
      enDescription,
      frDescription,
      rwDescription,
    } = req.body;

    if (!enTitle || !frTitle || !rwTitle) {
      return errorResponse(res, 400, 'All title translations are required');
    }

    const userId = req.tokenData._id;
    const updateData = {
      title: { en: enTitle, fr: frTitle, rw: rwTitle },
      description: {
        en: enDescription,
        fr: frDescription,
        rw: rwDescription,
      },
      updatedBy: userId,
    };

    if (req.file?.filename) {
      newFile = req.file.filename;
      updateData.image = newFile;
      deleteFileSafe(path.join('public', 'images', carouselFound.image));
    }

    const carousel = await Carousel.findOneAndUpdate(
      { _id: itemId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate(['createdBy', 'updatedBy']);

    return successResponse(res, 200, 'Carousel updated successfully', carousel);
  } catch (error) {
    console.error('Error in updateCarousel:', error);
    if (newFile) {
      deleteFileSafe(path.join('public', 'images', newFile));
    }
    return errorResponse(
      res,
      500,
      'Failed to update carousel',
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
};
export const deleteCarousel = async (req, res) => {
  try {
    const { itemId } = req.params;
    const carouselFound = await Carousel.findOne({ _id: itemId });
    if (!carouselFound) {
      return errorResponse(res, 404, 'Carousel not found');
    }
    await Carousel.deleteOne({ _id: itemId });
    fs.unlinkSync(`public/images/${carouselFound.image}`);
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
export const activateCarousel = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return errorResponse(res, 400, 'Invalid carousel ID');
    }

    const carouselFound = await Carousel.findOne({ _id: itemId });
    if (!carouselFound) {
      return errorResponse(res, 404, 'Carousel not found');
    }

    const userId = req.tokenData._id;
    const carousel = await Carousel.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: true,
          updatedBy: userId,
        },
      },
      { new: true, runValidators: true }
    ).populate(['createdBy', 'updatedBy']);

    return successResponse(res, 200, 'Carousel activated successfully', carousel);
  } catch (error) {
    console.error('Error in activateCarousel:', error);
    return errorResponse(
      res,
      500,
      'Failed to activate carousel',
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
};

export const archiveCarousel = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return errorResponse(res, 400, 'Invalid carousel ID');
    }

    const carouselFound = await Carousel.findOne({ _id: itemId });
    if (!carouselFound) {
      return errorResponse(res, 404, 'Carousel not found');
    }

    const userId = req.tokenData._id;
    const carousel = await Carousel.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: !carouselFound.isActive, // Toggle active status
          updatedBy: userId,
        },
      },
      { new: true, runValidators: true }
    ).populate(['createdBy', 'updatedBy']);

    const action = carouselFound.isActive ? 'archived' : 'activated';
    return successResponse(res, 200, `Carousel ${action} successfully`, carousel);
  } catch (error) {
    console.error('Error in archiveCarousel:', error);
    return errorResponse(
      res,
      500,
      'Failed to toggle carousel status',
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
};

// Similar patterns for deleteCarousel, activateCarousel, and archiveCarousel