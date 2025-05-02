const Post = require('../models/post.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createPost = catchAsync(async (req, res) => {
    const { content, image } = req.body;
    const post = await Post.create({
        content,
        image,
        author: req.user.id
    });

    await post.populate('author', 'name email profilePicture');
    
    res.status(201).json({
        status: 'success',
        data: post
    });
});

const getPosts = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name email profilePicture')
        .populate('likes');

    const total = await Post.countDocuments();

    res.status(200).json({
        status: 'success',
        results: posts.length,
        total,
        data: posts
    });
});

const getPost = catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate('author', 'name email profilePicture')
        .populate('likes');

    if (!post) {
        throw new ApiError(404, 'Post not found');
    }

    res.status(200).json({
        status: 'success',
        data: post
    });
});

const updatePost = catchAsync(async (req, res) => {
    const { content, image } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
        throw new ApiError(404, 'Post not found');
    }

    if (post.author.toString() !== req.user.id) {
        throw new ApiError(403, 'You can only update your own posts');
    }

    post.content = content || post.content;
    if (image !== undefined) {
        post.image = image;
    }

    await post.save();
    await post.populate('author', 'name email profilePicture');

    res.status(200).json({
        status: 'success',
        data: post
    });
});

const deletePost = catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        throw new ApiError(404, 'Post not found');
    }

    if (post.author.toString() !== req.user.id) {
        throw new ApiError(403, 'You can only delete your own posts');
    }

    await post.deleteOne();

    res.status(204).json({
        status: 'success',
        data: null
    });
});

module.exports = {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost
}; 