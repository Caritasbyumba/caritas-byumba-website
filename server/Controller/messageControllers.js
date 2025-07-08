import { errorResponse, successResponse } from '../Helpers/responses.js';
import Message from '../Models/Message.js';

export const addMessage = async (req, res) => {
  try {
    const { name, email, body } = req.body;
    const newMessage = new Message({
      name: name,
      email: email,
      body: body,
    });
    const message = await newMessage.save();
    return successResponse(res, 201, 'Message sent successfully', message);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).populate('repliedBy');
    return successResponse(
      res,
      200,
      'Messages retrieved successfully',
      messages
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const filterMessages = async (req, res) => {
  try {
    const { filter } = req.params;
    let replied = true;
    switch (filter) {
      case 'replied':
        replied = true;
        break;
      case 'notreplied':
        replied = false;
        break;
      default:
        replied = false;
        break;
    }
    const messages = await Message.find({ replied: replied }).populate(
      'repliedBy'
    );
    return successResponse(
      res,
      200,
      'Messages retrieved successfully',
      messages
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const replyMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const messageFound = await Message.findOne({ _id: messageId });
    if (!messageFound) {
      return errorResponse(res, 404, 'Message not found');
    }
    const { reply } = req.body;
    const message = await Message.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          reply: reply,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate('repliedBy');
    return successResponse(res, 200, 'Message replied', message);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
