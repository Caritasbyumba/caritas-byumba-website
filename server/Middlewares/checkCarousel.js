import Joi from 'joi';
import validationHelper from '../helpers/ValidationHelper.js';

const checkCarousel = (req, res, next) => {
  const carouselSchemas = Joi.object().keys({
    enTitle: Joi.string().trim().max(70).required().label('English title'),
    frTitle: Joi.string().trim().max(70).required().label('French title'),
    rwTitle: Joi.string().trim().max(70).required().label('Kinyarwanda title'),
    enDescription: Joi.string().trim().required().label('English description'),
    frDescription: Joi.string().trim().required().label('French description'),
    rwDescription: Joi.string()
      .trim()
      .required()
      .label('Kinyarwanda description'),
    image: Joi.optional(),
  });
  const schemasValidation = Joi.validate(req.body, carouselSchemas);
  validationHelper(req, res, schemasValidation, next);
};
export default checkCarousel;
