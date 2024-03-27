const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.log(err);

  const defineError = () => ({
    isError: true,
    name: err.name,
    message: err.message,
  });

  switch (err.name) {
    case 'Unauthorized':
      res.status(401).json(defineError());
      break;

    case 'ValidationError':
      res.status(400).json(defineError());
      break;

    case 'NotFoundError':
      res.status(404).json(defineError());
      break;

    default:
      err.name = 'InternalSeverError';
      err.message = 'Internal sever error';
      res.status(500).json(defineError());
  }

  return next(err);
};

module.exports = errorHandler;
