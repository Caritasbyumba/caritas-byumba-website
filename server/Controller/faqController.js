import { errorResponse, successResponse } from '../Helpers/responses.js';
import Faq from '../Models/Faq.js';

export const createFaq = async (req, res) => {
  try {
    const { enQuestion, frQuestion, rwQuestion, enAnswer, frAnswer, rwAnswer } =
      req.body;
    const userId = req.tokenData._id;
    const newFaq = new Faq({
      question: { en: enQuestion, fr: frQuestion, rw: rwQuestion },
      answer: {
        en: enAnswer,
        fr: frAnswer,
        rw: rwAnswer,
      },
      createdBy: userId,
      updatedBy: userId,
    });
    const faq = await newFaq.save();
    return successResponse(res, 201, 'Faq created successfully', faq);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({})
      .populate(['createdBy', 'updatedBy'])
      .sort({ updatedAt: 'desc' });
    return successResponse(res, 200, 'Faqs retrieved successfully', faqs);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getActiveFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({
      isActive: true,
    }).sort({ updatedAt: 'desc' });
    return successResponse(res, 200, 'Faqs retrieved successfully', faqs);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSpecificFaq = async (req, res) => {
  try {
    const { itemId } = req.params;
    const faqFound = await Faq.findOne({ _id: itemId }).populate([
      'createdBy',
      'updatedBy',
    ]);
    if (!faqFound) {
      return errorResponse(res, 404, 'Faq not found');
    }
    return successResponse(res, 200, 'Faq retrieved successfully', faqFound);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateFaq = async (req, res) => {
  try {
    const { itemId } = req.params;
    const faqFound = await Faq.findOne({ _id: itemId });
    if (!faqFound) {
      return errorResponse(res, 404, 'Faq not found');
    }
    const { enQuestion, frQuestion, rwQuestion, enAnswer, frAnswer, rwAnswer } =
      req.body;
    const userId = req.tokenData._id;
    const faq = await Faq.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          question: { en: enQuestion, fr: frQuestion, rw: rwQuestion },
          answer: {
            en: enAnswer,
            fr: frAnswer,
            rw: rwAnswer,
          },
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(res, 200, 'Faq edited successfully', faq);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const { itemId } = req.params;
    const faqFound = await Faq.findOne({ _id: itemId });
    if (!faqFound) {
      return errorResponse(res, 404, 'Faq not found');
    }
    await Faq.deleteOne({ _id: itemId });
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const activateFaq = async (req, res) => {
  try {
    const { itemId } = req.params;
    const faqFound = await Faq.findOne({ _id: itemId });
    if (!faqFound) {
      return errorResponse(res, 404, 'Faq not found');
    }
    const userId = req.tokenData._id;
    const faq = await Faq.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: true,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(res, 200, 'Faq edited successfully', faq);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const archiveFaq = async (req, res) => {
  try {
    const { itemId } = req.params;
    const faqFound = await Faq.findOne({ _id: itemId });
    if (!faqFound) {
      return errorResponse(res, 404, 'Faq not found');
    }
    const userId = req.tokenData._id;
    const faq = await Faq.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: !faqFound.isActive,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(res, 200, 'Faq edited successfully', faq);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
