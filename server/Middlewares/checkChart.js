import Joi from 'joi';
import validationHelper from '../helpers/ValidationHelper.js';

const checkChart = (req, res, next) => {
  const chartSchemas = Joi.object().keys({
    enTitle: Joi.string().trim().max(70).required().label('English title'),
    frTitle: Joi.string().trim().max(70).required().label('French title'),
    rwTitle: Joi.string().trim().max(70).required().label('Kinyarwanda title'),
    image: Joi.optional(),
  });
  const schemasValidation = Joi.validate(req.body, chartSchemas);
  validationHelper(req, res, schemasValidation, next);
};
export default checkChart;
