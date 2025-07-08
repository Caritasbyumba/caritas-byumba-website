import Joi from 'joi';
import validationHelper from '../helpers/ValidationHelper.js';

const checkAboutus = (req, res, next) => {
  const aboutusSchemas = Joi.object().keys({
    enName: Joi.string().trim().max(50).required().label('English name'),
    frName: Joi.string().trim().max(50).required().label('French name'),
    rwName: Joi.string().trim().max(50).required().label('Kinyarwanda name'),
    enDescription: Joi.string().trim().required().label('English description'),
    frDescription: Joi.string().trim().required().label('French description'),
    rwDescription: Joi.string()
      .trim()
      .required()
      .label('Kinyarwanda description'),
    enVision: Joi.string().trim().required().label('English vision'),
    frVision: Joi.string().trim().required().label('French vision'),
    rwVision: Joi.string().trim().required().label('Kinyarwanda vision'),
    enMission: Joi.string().trim().required().label('English mission'),
    frMission: Joi.string().trim().required().label('French mission'),
    rwMission: Joi.string().trim().required().label('Kinyarwanda mission'),
    enObjectives: Joi.string().trim().required().label('English objectives'),
    frObjectives: Joi.string().trim().required().label('French objectives'),
    rwObjectives: Joi.string()
      .trim()
      .required()
      .label('Kinyarwanda objectives'),
  });
  const schemasValidation = Joi.validate(req.body, aboutusSchemas);
  validationHelper(req, res, schemasValidation, next);
};
export default checkAboutus;
