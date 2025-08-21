const mongoose = require("mongoose");
const Post = require("../models/postModel");
const { s3Upload } = require("../utils/s3Upload");

// get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profile verified")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get a single post
const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate(
      "user",
      "username profile verified"
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create a post
const createPost = async (req, res) => {
  const { title, content } = req.body;

  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    let image = "";
    if (req.file) {
      image = await s3Upload(req.file, user._id);
    }

    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }

    const post = await Post.create({ title, content, image, user });

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOneAndDelete({ _id: id });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update a post
const updatePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Post ID" });
  }

  try {
    const post = await Post.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Post updated", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// like a post
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const hasLiked = post.likedBy.includes(userId);
    const hasDisliked = post.dislikedBy.includes(userId);

    if (hasLiked) {
      post.likedBy = post.likedBy.filter(
        (uid) => uid.toString() !== userId.toString()
      );
      post.likes--;
    } else {
      if (hasDisliked) {
        post.dislikedBy = post.dislikedBy.filter(
          (uid) => uid.toString() !== userId.toString()
        );
        post.dislikes--;
      }
      post.likedBy.push(userId);
      post.likes++;
    }

    await post.save();

    res.json({
      message: "Like status updated",
      likes: post.likes,
      dislikes: post.dislikes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating like status" });
  }
};

// dislike a post
const dislikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const hasDisliked = post.dislikedBy.includes(userId);
    const hasLiked = post.likedBy.includes(userId);

    if (hasDisliked) {
      post.dislikedBy = post.dislikedBy.filter(
        (uid) => uid.toString() !== userId.toString()
      );
      post.dislikes--;
    } else {
      if (hasLiked) {
        post.likedBy = post.likedBy.filter(
          (uid) => uid.toString() !== userId.toString()
        );
        post.likes--;
      }
      post.dislikedBy.push(userId);
      post.dislikes++;
    }

    await post.save();

    res.json({
      message: "Dislike status updated",
      likes: post.likes,
      dislikes: post.dislikes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating dislike status" });
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
  likePost,
  dislikePost,
};
