const auth = (req, res, next) => {
  const apiKey = req.headers['api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    const error = new Error('Unauthorized: Invalid API key');
    error.status = 401;
    return next(error);
  }
  next();
};

module.exports = auth;