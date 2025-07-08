import fs from 'fs';
import findBestMatch from '../Helpers/findBestMatch.js';
import { errorResponse, successResponse } from '../Helpers/responses.js';
import Project from '../Models/Project.js';
import ProjectsIntro from '../Models/ProjectsIntro.js';

export const createProject = async (req, res) => {
  try {
    const {
      name,
      enSmallDescription,
      frSmallDescription,
      rwSmallDescription,
      enDescription,
      frDescription,
      rwDescription,
      startDate,
      endDate,
      isMain,
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
    const newProject = new Project({
      name: name,
      smallDescription: {
        en: enSmallDescription,
        fr: frSmallDescription,
        rw: rwSmallDescription,
      },
      description: {
        en: enDescription,
        fr: frDescription,
        rw: rwDescription,
      },
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      gallery: images,
      imageDescriptions: updatedImageDescriptions,
      isMain: JSON.parse(isMain),
      createdBy: userId,
      updatedBy: userId,
    });
    const project = await newProject.save();
    return successResponse(res, 201, 'Project created successfully', project);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({})
      .populate(['createdBy', 'updatedBy'])
      .sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'Projects retrieved successfully',
      projects
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getActiveProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      isActive: true,
    }).sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'Projects retrieved successfully',
      projects
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getActiveMainProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      isMain: true,
      isActive: true,
    })
      .sort({ updatedAt: 'desc' })
      .limit(2);
    return successResponse(
      res,
      200,
      'Projects retrieved successfully',
      projects
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSpecificProject = async (req, res) => {
  try {
    const { itemId } = req.params;
    const projectFound = await Project.findOne({ _id: itemId }).populate([
      'createdBy',
      'updatedBy',
    ]);
    if (!projectFound) {
      return errorResponse(res, 404, 'Project not found');
    }
    return successResponse(
      res,
      200,
      'Project retrieved successfully',
      projectFound
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateProject = async (req, res) => {
  try {
    const { itemId } = req.params;
    const projectFound = await Project.findOne({ _id: itemId });
    if (!projectFound) {
      return errorResponse(res, 404, 'Project not found');
    }
    const {
      name,
      enSmallDescription,
      frSmallDescription,
      rwSmallDescription,
      enDescription,
      frDescription,
      rwDescription,
      startDate,
      endDate,
      isMain,
      imageDescriptions,
    } = req.body;
    const userId = req.tokenData._id;
    let images = [];
    let updatedImageDescriptions = [];
    let project;
    if (req.files && req.files.length > 0) {
      req.files.forEach((image) => {
        images.push(image.filename);
      });
      projectFound.gallery.forEach((image) => {
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
      project = await Project.findOneAndUpdate(
        { _id: itemId },
        {
          $set: {
            name: name,
            smallDescription: {
              en: enSmallDescription,
              fr: frSmallDescription,
              rw: rwSmallDescription,
            },
            description: {
              en: enDescription,
              fr: frDescription,
              rw: rwDescription,
            },
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            gallery: images,
            imageDescriptions: updatedImageDescriptions,
            isMain: JSON.parse(isMain),
            updatedBy: userId,
          },
        },
        { new: true }
      ).populate(['createdBy', 'updatedBy']);
    } else {
      project = await Project.findOneAndUpdate(
        { _id: itemId },
        {
          $set: {
            name: name,
            smallDescription: {
              en: enSmallDescription,
              fr: frSmallDescription,
              rw: rwSmallDescription,
            },
            description: {
              en: enDescription,
              fr: frDescription,
              rw: rwDescription,
            },
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            isMain: JSON.parse(isMain),
            updatedBy: userId,
          },
        },
        { new: true }
      ).populate(['createdBy', 'updatedBy']);
    }
    return successResponse(res, 200, 'Project edieted successfully', project);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { itemId } = req.params;
    const projectFound = await Project.findOne({ _id: itemId });
    if (!projectFound) {
      return errorResponse(res, 404, 'Project not found');
    }
    await Project.deleteOne({ _id: itemId });
    projectFound.gallery.forEach((image) => {
      fs.unlinkSync(`public/images/${image}`);
    });
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const activateProject = async (req, res) => {
  try {
    const { itemId } = req.params;
    const projectFound = await Project.findOne({ _id: itemId });
    if (!projectFound) {
      return errorResponse(res, 404, 'Project not found');
    }
    const userId = req.tokenData._id;
    const project = await Project.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: true,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(res, 200, 'Project edited successfully', project);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const archiveProject = async (req, res) => {
  try {
    const { itemId } = req.params;
    const projectFound = await Project.findOne({ _id: itemId });
    if (!projectFound) {
      return errorResponse(res, 404, 'project not found');
    }
    const userId = req.tokenData._id;
    const project = await Project.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: !projectFound.isActive,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(res, 200, 'Project edited successfully', project);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const createProjectsIntro = async (req, res) => {
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
    const newProjectsIntro = new ProjectsIntro({
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
    const projectsIntro = await newProjectsIntro.save();
    return successResponse(
      res,
      201,
      'ProjectsIntro created successfully',
      projectsIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getAllProjectsIntros = async (req, res) => {
  try {
    const projectsIntros = await ProjectsIntro.find({})
      .populate(['createdBy', 'updatedBy'])
      .sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'ProjectsIntros retrieved successfully',
      projectsIntros
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getActiveProjectsIntros = async (req, res) => {
  try {
    const projectsIntros = await ProjectsIntro.find({
      isActive: true,
    }).sort({ updatedAt: 'desc' });
    return successResponse(
      res,
      200,
      'ProjectsIntros retrieved successfully',
      projectsIntros[0]
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getSpecificProjectsIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const projectsIntroFound = await ProjectsIntro.findOne({
      _id: itemId,
    }).populate(['createdBy', 'updatedBy']);
    if (!projectsIntroFound) {
      return errorResponse(res, 404, 'ProjectsIntro not found');
    }
    return successResponse(
      res,
      200,
      'ProjectsIntro retrieved successfully',
      projectsIntroFound
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const updateProjectsIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const projectsIntroFound = await ProjectsIntro.findOne({ _id: itemId });
    if (!projectsIntroFound) {
      return errorResponse(res, 404, 'ProjectsIntro not found');
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
    const projectsIntro = await ProjectsIntro.findOneAndUpdate(
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
      'ProjectsIntro edieted successfully',
      projectsIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const deleteProjectsIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const projectsIntroFound = await ProjectsIntro.findOne({ _id: itemId });
    if (!projectsIntroFound) {
      return errorResponse(res, 404, 'ProjectsIntro not found');
    }
    await ProjectsIntro.deleteOne({ _id: itemId });
    return successResponse(res, 204);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const activateProjectsIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const projectsIntroFound = await ProjectsIntro.findOne({ _id: itemId });
    if (!projectsIntroFound) {
      return errorResponse(res, 404, 'ProjectsIntro not found');
    }
    const userId = req.tokenData._id;
    const projectsIntro = await ProjectsIntro.findOneAndUpdate(
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
      'ProjectsIntro edited successfully',
      projectsIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const archiveProjectsIntro = async (req, res) => {
  try {
    const { itemId } = req.params;
    const projectsIntroFound = await ProjectsIntro.findOne({ _id: itemId });
    if (!projectsIntroFound) {
      return errorResponse(res, 404, 'projectsIntro not found');
    }
    const userId = req.tokenData._id;
    const projectsIntro = await ProjectsIntro.findOneAndUpdate(
      { _id: itemId },
      {
        $set: {
          isActive: !projectsIntroFound.isActive,
          updatedBy: userId,
        },
      },
      { new: true }
    ).populate(['createdBy', 'updatedBy']);
    return successResponse(
      res,
      200,
      'ProjectsIntro edited successfully',
      projectsIntro
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
