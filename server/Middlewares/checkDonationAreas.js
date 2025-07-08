import Joi from 'joi';
import validationHelper from '../helpers/ValidationHelper.js';

const checkDonationAreas = (req, res, next) => {
  const donationAreasSchemas = Joi.object().keys({
    enName: Joi.string().trim().required().label('English name'),
    frName: Joi.string().trim().required().label('French name'),
    rwName: Joi.string().trim().required().label('Kinyarwanda name'),
    enDescription: Joi.string().trim().required().label('English description'),
    frDescription: Joi.string().trim().required().label('French description'),
    rwDescription: Joi.string()
      .trim()
      .required()
      .label('Kinyarwanda description'),
    projects: Joi.array(),
  });
  const schemasValidation = Joi.validate(req.body, donationAreasSchemas);
  validationHelper(req, res, schemasValidation, next);
};
export default checkDonationAreas;
