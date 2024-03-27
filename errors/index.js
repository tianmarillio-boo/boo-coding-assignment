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
      return res.status(401).json(defineError());

    case 'ValidationError':
      return res.status(400).json(defineError());

    case 'NotFoundError':
      return res.status(404).json(defineError());

    default:
      err.name = 'InternalSeverError';
      err.message = 'Internal sever error';
      return res.status(500).json(defineError());
  }
};

module.exports = errorHandler;
