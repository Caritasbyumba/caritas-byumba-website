import Joi from 'joi';
import validationHelper from '../helpers/ValidationHelper.js';

const checkProject = (req, res, next) => {
  const projectSchemas = Joi.object().keys({
    name: Joi.string().trim().max(50).required(),
    enSmallDescription: Joi.string()
      .trim()
      .max(500)
      .required()
      .label('English small description'),
    frSmallDescription: Joi.string()
      .trim()
      .max(500)
      .required()
      .label('French small description'),
    rwSmallDescription: Joi.string()
      .trim()
      .max(500)
      .required()
      .label('Kinyarwanda small description'),
    enDescription: Joi.string().trim().required().label('English description'),
    frDescription: Joi.string().trim().required().label('French description'),
    rwDescription: Joi.string()
      .trim()
      .required()
      .label('Kinyarwanda description'),
    images: Joi.optional(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    isMain: Joi.boolean().required(),
    imageDescriptions: Joi.optional(),
  });
  const schemasValidation = Joi.validate(req.body, projectSchemas);
  validationHelper(req, res, schemasValidation, next);
};
export default checkProject;
