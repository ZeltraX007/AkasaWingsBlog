//imports
var ObjectId = require('mongoose').Types.ObjectId;
//models
const Post = require('../models/Post');
const Comment = require('../models/Comment');
//helpers
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const extractHashtags = require('../helpers/extract-hashtags');

module.exports = class PostController {
  //FUNCTION TO CREATE NEW POST
  static async create(req, res) {
    //get token from req
    const token = getToken(req);
    //get current user data
    const user = await getUserByToken(token, res);

    const { title, content, tags } = req.body;

    //validations
    if (!title) {
      res.status(422).json({ message: 'The post title is mandatory.' });
      return;
    }

    if (!content) {
      res.status(422).json({ message: 'The content of the post is mandatory.' });
      return;
    }

    if (!tags) {
      res.status(422).json({ message: 'Add at least one tag to the post.' });
      return;
    }

    const tagsArray = extractHashtags(tags);

    if (!tagsArray || tagsArray.length <= 0) {
      res.status(422).json({ message: 'the tag field cannot be empty.' });
      return;
    }

    //image upload
    let image;

    // adding image path
    if (req.file) {
      image = req.file.path;
    } else {
      res
        .status(422)
        .json({ message: 'Please add an image to the post.' });
      return;
    }

    try {
      //creating post
      const post = new Post({
        title: title,
        content: content,
        tags: tagsArray,
        image: image,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });

      await post.save();

      res.status(201).json({
        message: 'Post created successfully!',
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message:
          'Unable to create post. Please try again later.',
      });
      return;
    }
  }
  //FUNCTION TO GET ALL POSTS
  static async getAllPosts(req, res) {
    const posts = await Post.find().sort('-createdAt');

    res.status(200).send(posts);
  }

  //FUNCTION TO GET ALL USER POSTS
  static async getUserPosts(req, res) {
    const token = await getToken(req);
    //get current user
    const user = await getUserByToken(token, res);

    //get all users posts by user id
    const posts = await Post.find({ 'user._id': user._id }).sort('-createdAt');

    res.status(200).send(posts);
  }

  //FUNCTION TO GET POST BY ID
  static async getPostById(req, res) {
    const id = req.params.id;

    //check if id is valid
    if (!ObjectId.isValid(id)) {
      res.status(401).json({ message: 'Invalid ID!' });
      return;
    }

    //get post by id
    const post = await Post.findById(id);

    //check if post exists
    if (!post) {
      res.status(404).json({ message: 'Post not found!' });
      return;
    }

    res.status(200).json(post);
  }

  //FUNCTION TO REMOVE POST FROM URL PARAM
  static async removePostById(req, res) {
    const id = req.params.id;

    //check if id is valid
    if (!ObjectId.isValid(id)) {
      res.status(401).json({ message: 'Invalid ID' });
      return;
    }

    //get post by id
    const post = await Post.findById(id);

    //check if post exists
    if (!post) {
      res.status(404).json({ message: 'Post not found!' });
      return;
    }

    //get current user
    const token = getToken(req);
    const user = await getUserByToken(token, res);

    //check if user inside post is the same as current user
    if (user._id.toString() !== post.user._id.toString()) {
      res.status(403).json({
        message: 'You do not have permission to access or modify this post.',
      });
      return;
    }

    try {
      //remove post
      await Post.findByIdAndRemove(post._id);

      //get comments that have same id as deleted post and delete them
      await Comment.deleteMany({ 'post._id': id });

      res.status(200).json({
        message: 'Post successfully removed.',
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'An error occurred while removing the post.',
      });
      return;
    }
  }

  //FUNCTION TO UPDATE POST BY ID
  static async updatePostById(req, res) {
    const id = req.params.id;

    //check if id is valid
    if (!ObjectId.isValid(id)) {
      res.status(401).json({ message: 'Invalid ID!' });
      return;
    }

    //get post by id
    const post = await Post.findById(id);

    //check if post exists
    if (!post) {
      res.status(404).json({ message: 'Post not found!' });
      return;
    }

    //get current user
    const token = getToken(req);
    const user = await getUserByToken(token, res);

    //check if user inside post is the same as current user
    if (user._id.toString() !== post.user._id.toString()) {
      res.status(403).json({
        message: 'You do not have permission to access or modify this post.',
      });
      return;
    }

    //getting request data
    const { title, content, tags } = req.body;

    //creating new data object
    let updatedData = {};

    //validations
    if (!title) {
      res.status(422).json({ message: 'The post title is mandatory.' });
      return;
    }

    updatedData.title = title;

    if (!content) {
      res.status(422).json({ message: 'The content of the post is mandatory.' });
      return;
    }

    updatedData.content = content;

    if (!tags) {
      res.status(422).json({ message: 'Add at least one tag to the post.' });
      return;
    }

    const tagsArray = extractHashtags(tags);

    if (!tagsArray || tagsArray.length <= 0) {
      res.status(422).json({ message: 'the tag field cannot be empty.' });
      return;
    }

    updatedData.tags = tagsArray;

    // adding image path
    if (req.file) {
      updatedData.image = req.file.path;
    }

    try {
      await Post.findByIdAndUpdate(id, updatedData);

      res.status(200).json({ message: 'Post updated successfully!' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'There was an error updating the post.' });
    }
  }
};
