const { getUserByEmail, getUserByUsername } = require("../../db/user");

// check user has provided a username and password in body of request
const checkUserData = (req, res, next) => {
  const { username, password } = req.body;
  if (!username?.length || !password?.length) {
    return res.status(400).send({
      message: "Please provide a username and password",
    });
  }
  next();
};

const checkUserExists = async (req, res, next) => {
  // check if a user with username from request already exists
  const username_exists = (await getUserByUsername(req.body.username))[0];

  //   if user registers with an email, check if an account already exists with request email
  const email_exists =
    req.body.email && (await getUserByEmail(req.body.email))[0];
  console.log(email_exists);

  if (username_exists) {
    return res.status(409).send({
      name: "DuplicateUsernameError",
      message: "An account with that username already exits",
    });
  }

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
