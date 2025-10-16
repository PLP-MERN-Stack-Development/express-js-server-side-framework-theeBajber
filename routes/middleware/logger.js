const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Method: ${req.method}, URL: ${req.url}`);
  next();
};

module.exports = logger;