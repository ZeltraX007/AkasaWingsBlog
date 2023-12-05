//imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var ObjectId = require('mongoose').Types.ObjectId;
//models
const User = require('../models/User');
const Post = require('../models/Post');
//helpers
const createUserToken = require('../helpers/create-user-token');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const Comment = require('../models/Comment');

module.exports = class UserController {
  //FUNCTION TO REGISTER NEW USERS
  static async register(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    //validations
    if (!name) {
      res.status(422).json({ message: 'Please fill in the name field.' });
      return;
    }
    if (!email) {
      res
        .status(422)
        .json({ message: 'Please fill in the email field.' });
      return;
    }

    if (!password) {
      res
        .status(422)
        .json({ message: 'Please fill in the password field.' });
      return;
    }
    if (!confirmpassword) {
      res.status(422).json({
        message: 'Please fill in the password confirmation field.',
      });
      return;
    }

    if (password !== confirmpassword) {
      res.status(422).json({ message: 'Passwords do not match.' });
      return;
    }

    try {
      //check if user with email exists
      const checkUser = await User.findOne({ email: email });

      if (checkUser) {
        res.status(422).json({
          message: 'There is already a registered user with this email.',
        });
        return;
      }

      //hashing password
      const salt = bcrypt.genSaltSync(12);
      const hashPassword = bcrypt.hashSync(password, salt);

      //creating new user
      const newUser = new User({ name, email, password: hashPassword });

      await newUser.save();

      //return JWT
      await createUserToken(newUser, req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message:
          'Unable to create your account. Please try again later.',
      });
      return;
    }
  }
  //FUNCTION TO SIGN IN USERS
  static async login(req, res) {
    const { email, password } = req.body;

    //validations
    if (!email) {
      res
        .status(422)
        .json({ message: 'Please fill in the email field.' });
      return;
    }

    if (!password) {
      res
        .status(422)
        .json({ message: 'Please fill in the password field.' });
      return;
    }

    try {
      //check if user with email exists
      const user = await User.findOne({ email: email });

      if (!user) {
        res.status(422).json({
          message: 'There is no registered user with this email.',
        });
        return;
      }

      //check if password matches
      const passwordMatch = bcrypt.compareSync(password, user.password);

      if (!passwordMatch) {
        res
          .status(422)
          .json({ message: 'Incorrect password. Please try again.' });
        return;
      }

      //return JWT
      await createUserToken(user, req, res);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message:
          'Unable to login. Please try again later.',
      });
      return;
    }
  }
  //FUNCTION TO CHECK CURRENT USER
  static async checkUser(req, res) {
    let currentUser;

    const token = await getToken(req);

    if (token) {
      try {
        //validate token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        if (!decoded) {
          res.status(401).json({ message: 'Access denied!' });
          return;
        }

        //get current user data
        currentUser = await User.findOne({ _id: decoded.id }).select(
          '-password',
        );
      } catch (err) {
        res.status(401).json({ message: 'Token Invalid!' });
        return;
      }
    } else {
      currentUser = null;
    }

    res.status(200).send({ currentUser });
  }

  //FUNCTION TO GET CURRENT USER BY URL PARAM
  static async getUserById(req, res) {
    const id = req.params.id;

    //check if id is valid
    if (!ObjectId.isValid(id)) {
      res.status(401).json({ message: 'ID Invalid!' });
      return;
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      res.status(401).json({ message: 'User Not Found!' });
      return;
    }

    res.status(200).send(user);
  }

  //FUNCTION TO UPDATE USERS INFORMATION
  static async update(req, res) {
    //get user token
    const token = await getToken(req);
    //get current user by token
    const currentUser = await getUserByToken(token, res);
    const user = {};

    const { name, email, password, confirmpassword } = req.body;

    // adding image path
    if (req.file) {
      user.image = req.file.path;
    }

    //validations

    if (!name) {
      res.status(422).json({ message: 'Please fill in the name field.' });
      return;
    }

    user.name = name;

    if (!email) {
      res
        .status(422)
        .json({ message: 'Please fill in the email field.' });
      return;
    }

    //check if email is being used
    const checkEmail = await User.findOne({ email: email });

    if (email !== currentUser.email && checkEmail) {
      res.status(422).json({
        message:
          'Sorry, this email is already in use. Please try another email.',
      });
      return;
    }

    user.email = email;

    if (password !== confirmpassword) {
      res.status(422).json({ message: 'Passwords do not match.' });
      return;
    } else if (password === confirmpassword && password) {
      //hashing password
      const salt = await bcrypt.genSaltSync(12);
      const passwordHash = await bcrypt.hashSync(password, salt);

      user.password = passwordHash;
    }

    try {
      // update user information
      const updatedUser = await User.findOneAndUpdate(
        { _id: currentUser.id },
        { $set: user },
        { new: true },
      );

      // update user information in posts
      await Post.updateMany(
        { 'user._id': updatedUser._id },
        {
          $set: {
            user: {
              _id: updatedUser._id,
              name: updatedUser.name,
              email: updatedUser.email,
            },
          },
        },
      );

      // update user information in comments
      await Comment.updateMany(
        { 'user._id': updatedUser._id },
        {
          $set: {
            user: {
              _id: updatedUser._id,
              name: updatedUser.name,
              email: updatedUser.email,
              image: updatedUser.image,
            },
          },
        },
      );

      res.status(200).json({ message: 'Data updated successfully!' });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message:
          'Your data could not be updated. Please try again later.',
      });
      return;
    }
  }
};
