import fs from 'fs';

import { errorResponse, successResponse } from '../Helpers/responses.js';
import Chart from '../Models/Chart.js';

export const createChart = async (req, res) => {
  try {
    const {
      enTitle,
      frTitle,
      rwTitle,
    } = req.body;
    const userId = req.tokenData._id;
    const newChart = new Chart({
      title: { en: enTitle, fr: frTitle, rw: rwTitle },
      image: req.file.filename,
      createdBy: userId,
      updatedBy: userId,
    });
    const chart = await newChart.save();
    return successResponse(res, 201, 'Chart created successfully', chart);
  } catch (error) {
    fs.unlinkSync(`public/images/${req.file.filename}`);
    return errorResponse(res, 500, error.message);
  }
};

export const getAllCharts = async (req, res) => {
  try {
    const charts = await Chart.find({})
      .populate(['createdBy', 'updatedBy'])
      .sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'Charts retrieved successfully',
      charts
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getActiveCharts = async (req, res) => {
  try {
    const charts = await Chart.find({
      isActive: true,
    }).sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'Charts retrieved successfully',
      charts[0]
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSpecificChart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const chartFound = await Chart.findOne({ _id: itemId }).populate([
      'createdBy',
      'updatedBy',
    ]);
    if (!chartFound) {
      return errorResponse(res, 404, 'Chart not found');
    }
    return successResponse(
      res,
      200,
      'Chart retrieved successfully',
      chartFound
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateChart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const chartFound = await Chart.findOne({ _id: itemId });
    if (!chartFound) {
      return errorResponse(res, 404, 'Chart not found');
    }
    const {
      enTitle,
      frTitle,
      rwTitle,
    } = req.body;
    const userId = req.tokenData._id;
    let chart;
    if (req.file?.filename) {
      fs.unlinkSync(`public/images/${chartFound.image}`);
      chart = await Chart.findOneAndUpdate(
        { _id: itemId },
        {
          $set: {
            title: { en: enTitle, fr: frTitle, rw: rwTitle },
            image: req.file.filename,
            updatedBy: userId,
          },
        },
        { new: true }
      ).populate(['createdBy', 'updatedBy']);
    } else {
      chart = await Chart.findOneAndUpdate(
        { _id: itemId },
        {
          $set: {
            title: { en: enTitle, fr: frTitle, rw: rwTitle },
            updatedBy: userId,
          },
        },
        { new: true }
      ).populate(['createdBy', 'updatedBy']);
    }
    return successResponse(res, 200, 'Chart edited successfully', chart);
  } catch (error) {
    fs.unlinkSync(`public/images/${req.file.filename}`);
    return errorResponse(res, 500, error.message);
  }
};

export const deleteChart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const chartFound = await Chart.findOne({ _id: itemId });
    if (!chartFound) {
      return errorResponse(res, 404, 'Chart not found');
    }
    await Chart.deleteOne({ _id: itemId });
    fs.unlinkSync(`public/images/${chartFound.image}`);
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const activateChart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const chartFound = await Chart.findOne({ _id: itemId });
    if (!chartFound) {
      return errorResponse(res, 404, 'Chart not found');
    }
    const userId = req.tokenData._id;
    const chart = await Chart.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: true,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(res, 200, 'Chart edited successfully', chart);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const archiveChart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const chartFound = await Chart.findOne({ _id: itemId });
    if (!chartFound) {
      return errorResponse(res, 404, 'Chart not found');
    }
    const userId = req.tokenData._id;
    const chart = await Chart.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: !chartFound.isActive,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(res, 200, 'Chart edited successfully', chart);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
