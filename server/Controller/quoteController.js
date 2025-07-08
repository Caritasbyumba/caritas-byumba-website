import fs from 'fs';

import { errorResponse, successResponse } from '../Helpers/responses.js';
import Quote from '../Models/Quote.js';

export const createQuote = async (req, res) => {
  try {
    const { name, enRole, frRole, rwRole, enQuote, frQuote, rwQuote, order } =
      req.body;
    const userId = req.tokenData._id;
    const newQuote = new Quote({
      name: name,
      role: { en: enRole, fr: frRole, rw: rwRole },
      quote: { en: enQuote, fr: frQuote, rw: rwQuote },
      order: order,
      profile: req.file.filename,
      createdBy: userId,
      updatedBy: userId,
    });
    const createdQuote = await newQuote.save();
    return successResponse(
      res,
      201,
      'Quote created successfully',
      createdQuote
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getAllQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({})
      .populate(['createdBy', 'updatedBy'])
      .sort({ updatedAt: 'desc' });
    return successResponse(res, 200, 'Quotes retrieved successfully', quotes);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getActiveQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({
      isActive: true,
    }).sort({ order: 'asc' });
    return successResponse(res, 200, 'Quote retrieved successfully', quotes);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSpecificQuote = async (req, res) => {
  try {
    const { itemId } = req.params;
    const quoteFound = await Quote.findOne({ _id: itemId }).populate([
      'createdBy',
      'updatedBy',
    ]);
    if (!quoteFound) {
      return errorResponse(res, 404, 'Quote not found');
    }
    return successResponse(
      res,
      200,
      'Quote retrieved successfully',
      quoteFound
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateQuote = async (req, res) => {
  try {
    const { itemId } = req.params;
    const quoteFound = await Quote.findOne({ _id: itemId });
    if (!quoteFound) {
      return errorResponse(res, 404, 'Quote not found');
    }
    const { name, enRole, frRole, rwRole, enQuote, frQuote, rwQuote, order } =
      req.body;
    const userId = req.tokenData._id;
    let updatedQuote;
    if (req.file?.filename) {
      fs.unlinkSync(`public/images/${quoteFound.profile}`);
      updatedQuote = await Quote.findOneAndUpdate(
        { _id: itemId },
        {
          $set: {
            name: name,
            role: { en: enRole, fr: frRole, rw: rwRole },
            quote: { en: enQuote, fr: frQuote, rw: rwQuote },
            order: order,
            profile: req.file.filename,
            updatedBy: userId,
          },
        },
        { new: true }
      ).populate(['createdBy', 'updatedBy']);
    } else {
      updatedQuote = await Quote.findOneAndUpdate(
        { _id: itemId },
        {
          $set: {
            name: name,
            role: { en: enRole, fr: frRole, rw: rwRole },
            quote: { en: enQuote, fr: frQuote, rw: rwQuote },
            order: order,
            updatedBy: userId,
          },
        },
        { new: true }
      ).populate(['createdBy', 'updatedBy']);
    }
    return successResponse(res, 200, 'Quote edited successfully', updatedQuote);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deleteQuote = async (req, res) => {
  try {
    const { itemId } = req.params;
    const quoteFound = await Quote.findOne({ _id: itemId });
    if (!quoteFound) {
      return errorResponse(res, 404, 'Quote not found');
    }
    await Quote.deleteOne({ _id: itemId });
    fs.unlinkSync(`public/images/${quoteFound.profile}`);
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const activateQuote = async (req, res) => {
  try {
    const { itemId } = req.params;
    const quoteFound = await Quote.findOne({ _id: itemId });
    if (!quoteFound) {
      return errorResponse(res, 404, 'Quote not found');
    }
    const userId = req.tokenData._id;
    const quote = await Quote.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: true,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(res, 200, 'Quote edited successfully', quote);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const archiveQuote = async (req, res) => {
  try {
    const { itemId } = req.params;
    const quoteFound = await Quote.findOne({ _id: itemId });
    if (!quoteFound) {
      return errorResponse(res, 404, 'Quote not found');
    }
    const userId = req.tokenData._id;
    const quote = await Quote.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: !quoteFound.isActive,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(res, 200, 'Quote edited successfully', quote);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
