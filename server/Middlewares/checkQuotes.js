import Joi from 'joi';
import validationHelper from '../helpers/ValidationHelper.js';

const checkQuotes = (req, res, next) => {
  const quotesSchemas = Joi.object().keys({
    name: Joi.string().trim().required(),
    enRole: Joi.string().trim().required().label('English role'),
    frRole: Joi.string().trim().required().label('French role'),
    rwRole: Joi.string().trim().required().label('Kinyarwanda role'),
    enQuote: Joi.string().trim().required().label('English quote'),
    frQuote: Joi.string().trim().required().label('French quote'),
    rwQuote: Joi.string().trim().required().label('Kinyarwanda quote'),
    profile: Joi.optional(),
    order: Joi.number().positive().required(),
  });
  const schemasValidation = Joi.validate(req.body, quotesSchemas);
  validationHelper(req, res, schemasValidation, next);
};
export default checkQuotes;
