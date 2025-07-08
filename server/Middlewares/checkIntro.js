import Joi from 'joi';
import validationHelper from '../helpers/ValidationHelper.js';

const checkIntro = (req, res, next) => {
  const introSchemas = Joi.object().keys({
    enTitle: Joi.string().trim().max(50).required().label('English title'),
    frTitle: Joi.string().trim().max(50).required().label('French title'),
    rwTitle: Joi.string().trim().max(50).required().label('Kinyarwanda title'),
    enDescription: Joi.string().trim().required().label('English description'),
    frDescription: Joi.string().trim().required().label('French description'),
    rwDescription: Joi.string()
      .trim()
      .required()
      .label('Kinyarwanda description'),
  });
  const schemasValidation = Joi.validate(req.body, introSchemas);
  validationHelper(req, res, schemasValidation, next);
};
export default checkIntro;
