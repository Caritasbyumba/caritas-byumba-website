import Joi from 'joi';
import validationHelper from '../helpers/ValidationHelper.js';

const checkPublication = (req, res, next) => {
  const publicationSchemas = Joi.object().keys({
    enTitle: Joi.string().trim().max(500).required().label('English title'),
    frTitle: Joi.string().trim().max(500).required().label('French title'),
    rwTitle: Joi.string().trim().max(500).required().label('Kinyarwanda title'),
    enDescription: Joi.string().trim().required().label('English description'),
    frDescription: Joi.string().trim().required().label('French description'),
    rwDescription: Joi.string()
      .trim()
      .required()
      .label('Kinyarwanda description'),
    images: Joi.optional(),
    tags: Joi.array().required(),
    imageDescriptions: Joi.optional(),
  });
  const schemasValidation = Joi.validate(req.body, publicationSchemas);
  validationHelper(req, res, schemasValidation, next);
};
export default checkPublication;
