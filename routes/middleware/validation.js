const ValidationError = require('../errors/customErrors').ValidationError;

const validateProduct = (req, res, next) => {
  const { name, price } = req.body; // Basic validation
  if (!name || typeof name !== 'string') {
    const error = new ValidationError('Name is required and must be a string');
    return next(error);
  }
  if (typeof price !== 'number' || price < 0) {
    const error = new ValidationError('Price must be a positive number');
    return next(error);
  }
  next();
};

module.exports = { validateProduct };