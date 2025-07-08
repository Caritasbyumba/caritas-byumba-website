import Joi from 'joi';
import validationHelper from '../helpers/ValidationHelper.js';

const checkFaq = (req, res, next) => {
  const faqSchemas = Joi.object().keys({
    enQuestion: Joi.string().trim().required().label('English question'),
    frQuestion: Joi.string().trim().required().label('French question'),
    rwQuestion: Joi.string().trim().required().label('Kinyarwanda question'),
    enAnswer: Joi.string().trim().required().label('English answer'),
    frAnswer: Joi.string().trim().required().label('French answer'),
    rwAnswer: Joi.string().trim().required().label('Kinyarwanda answer'),
  });
  const schemasValidation = Joi.validate(req.body, faqSchemas);
  validationHelper(req, res, schemasValidation, next);
};
export default checkFaq;
