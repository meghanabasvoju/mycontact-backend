const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

//@desc register the user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  //Take the response from the user username,email and password
  const { userName, gmail, password } = req.body;

  //check if the user does not provide any of the info throw an error
  if (!userName || !gmail || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  //find if the user is already available in the database check using the field called email
  const userAvailable = await User.findOne({ gmail });

  //if the user already available in the database
  if (userAvailable) {
    res.status(400);
    throw new Error("User already Available");
  }
  //password cannot be stored in the database because it is a raw hash password.so we need to convert the client password in to the hash code using the library called 'Bycrypt'
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password: +" + hashedPassword);

  //if we do not find any user in the database we create the new User
  const user = await User.create({
    userName,
    gmail,
    password: hashedPassword,
  });

  console.log(`user created ${user}`);
  //if the user was created then show the data to the user
  if (user) {
    res
      .status(201)
      .json({ _id: user.id, username: user.userName, gmail: user.gmail });
  }
  //if the user data is not valid then throw an error
  else {
    res.status(400);
    throw new Error("User data is not valid");
  }

  res.json({ message: "Register the user" });
});

//@desc the login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  //take the info from the req body
  const { gmail, password } = req.body;

  //if the user doesnt provide the email and password throw an error
  if (!gmail || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  //if the user provided the email and password then compare the email and password in the database
  const user = await User.findOne({ gmail });
  if (user && (await bcrypt.compare(password, user.password))) {
    //in the response we need to provide the accesstoken
    const accesstoken = jwt.sign(
      {
        user: {
          userName: user.userName,
          gmail: user.gmail,
          id: user.id,
        },
      },
      //use the Access token secret key here
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accesstoken });
  } else {
    //entered email and password are not valid (or) correct
    res.status(401);
    throw new Error("gmail and Password are not valid");
  }
});

//@desc current user
//@route GET /api/contacts/current
//@access private: Because the current user info should be private because the user details should not be visible to others
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
