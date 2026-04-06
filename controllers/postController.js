import Post from '../models/Post.js';
import path from 'path';
import fs from 'fs';

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    if (!posts.length) {
      return res.status(200).json({
        message: "No posts found",
        data: []
      });
    }
    res.status(200).json({
      totalPosts: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOnePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a post
export const createPost = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({
      message: "Title and description are required"
    });
  }

  try {
    const image = req.file ? req.file.path : null;
    const post = await Post.create({
      title,
      description,
      image
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  const {id} = req.params
  if (!id) {
    return res.status(400).json({
      message:"Id is required"
    })
  }
  try {
   const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.image) {
      const imagePath = path.join("uploads", path.basename(post.image));

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    const deletedPost = await Post.findByIdAndDelete(id);
    res.status(200).json({ 
      message: 'Post deleted successfully',
      deletedPost
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
