//whenever you call any api it will use this error handler only

const errorHandler = (err, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({ message: err, stack: err.stack });
};

module.exports = errorHandler;
