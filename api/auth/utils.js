const { getUserByEmail } = require("../../db/users");

// check user has provided a username and password in body of request
const checkUserData = (req, res, next) => {
  const { email, password } = req.body;
  if (!email?.length || !password?.length) {
    return res.status(400).send({
      message: "Please provide an email and password",
    });
  }
  next();
};

const checkUserExists = async (req, res, next) => {
  // check if a user with username from request already exists

  //   if user registers with an email, check if an account already exists with request email
  const email_exists =
    req.body.email && (await getUserByEmail(req.body.email))[0];

  if (email_exists) {
    return res.status(409).send({
      name: "DuplicateEmailError",
      message: "An account with that email already exits",
    });
  }

  next();
};

module.exports = {
  checkUserData,
  checkUserExists,
};
