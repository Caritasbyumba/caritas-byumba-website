import Joi from 'joi';
import validationHelper from '../helpers/ValidationHelper.js';

const checkService = (req, res, next) => {
  const serviceSchemas = Joi.object().keys({
    name: Joi.string().trim().max(100).required(),
    enSmallDescription: Joi.string()
      .trim()
      .required()
      .label('English small description'),
    frSmallDescription: Joi.string()
      .trim()
      .required()
      .label('French small description'),
    rwSmallDescription: Joi.string()
      .trim()
      .required()
      .label('Kinyarwanda small description'),
    enChallenges: Joi.string().trim().required().label('English challenges'),
    frChallenges: Joi.string().trim().required().label('French challenges'),
    rwChallenges: Joi.string()
      .trim()
      .required()
      .label('Kinyarwanda challenges'),
    department: Joi.string().required(),
    image: Joi.optional(),
  });
  const schemasValidation = Joi.validate(req.body, serviceSchemas);
  validationHelper(req, res, schemasValidation, next);
};
export default checkService;
