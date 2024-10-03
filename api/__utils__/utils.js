// middleware to ensure user is logged in before accessing authenticated functions
const requireUser = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .send({ message: "You must be logged in to do that" });
  }
  next();
};

module.exports = { requireUser };
