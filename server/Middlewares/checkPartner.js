import Joi from 'joi';
import validationHelper from '../helpers/ValidationHelper.js';

const checkPartner = (req, res, next) => {
  const partnerSchemas = Joi.object().keys({
    name: Joi.string().trim().max(70).required(),
    enQuote: Joi.string().trim().required().label('English quote'),
    frQuote: Joi.string().trim().required().label('French quote'),
    rwQuote: Joi.string().trim().required().label('Kinyarwanda quote'),
    enDescription: Joi.string().trim().required().label('English description'),
    frDescription: Joi.string().trim().required().label('French description'),
    rwDescription: Joi.string()
      .trim()
      .required()
      .label('Kinyarwanda description'),
    image: Joi.optional(),
  });
  const schemasValidation = Joi.validate(req.body, partnerSchemas);
  validationHelper(req, res, schemasValidation, next);
};
export default checkPartner;
