const appError = (next, message, httpStatus = 400) => {
  const error = new Error(message);
  error.statusCode = httpStatus;
  error.isOperational = true;
  next(error);
};

module.exports = appError;
