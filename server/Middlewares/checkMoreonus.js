import Joi from 'joi';
import validationHelper from '../Helpers/ValidationHelper.js';

const checkMoreonus = (req, res, next) => {
  const moreonusSchemas = Joi.object().keys({
    enDescription: Joi.string().trim().required().label('English description'),
    frDescription: Joi.string().trim().required().label('French description'),
    rwDescription: Joi.string()
      .trim()
      .required()
      .label('Kinyarwanda description'),
  });
  const schemasValidation = Joi.validate(req.body, moreonusSchemas);
  validationHelper(req, res, schemasValidation, next);
};
export default checkMoreonus;
