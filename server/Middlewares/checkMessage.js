import Joi from 'joi';
import validationHelper from '../helpers/ValidationHelper.js';

const checkMessage = (req, res, next) => {
  const messageSchemas = Joi.object().keys({
    name: Joi.string().trim().max(255).required(),
    email: Joi.string()
      .trim()
      .regex(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      )
      .error(() => ({
        message: 'Email is not valid',
      })),
    body: Joi.string().trim().required(),
  });
  const schemasValidation = Joi.validate(req.body, messageSchemas);
  validationHelper(req, res, schemasValidation, next);
};
export default checkMessage;
