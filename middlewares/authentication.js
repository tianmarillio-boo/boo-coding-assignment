const authentication = (req, res, next) => {
  // Extract username from request headers
  // note: should use Bearer token or other methods for secure auth

  const { username } = req.headers;

  if (!username) {
    throw {
      name: 'Unauthorized',
      message: 'Please login first!',
    };
  }

  req.username = username;

  next();
};

module.exports = authentication;
