import fs from 'fs';

const validationHelper = (req, res, schemasValidation, next) => {
  if (schemasValidation.error) {
    const validationErrors = [];
    for (let i = 0; i < schemasValidation.error.details.length; i += 1) {
      validationErrors.push(
        schemasValidation.error.details[i].message.split('"').join(' ')
      );
    }
    if (req.file && req.file.filename) {
      fs.unlinkSync(`public/images/${req.file.filename}`);
    }
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        fs.unlinkSync(`public/images/${file.filename}`);
      });
    }
    return res.status(400).json({
      status: 400,
      error: validationErrors[0],
      path: schemasValidation.error.details[0].path[0],
    });
  }
  next();
};
export default validationHelper;
