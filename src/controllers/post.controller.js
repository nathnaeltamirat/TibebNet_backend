const Post = require('../models/post.model');
const User = require('../models/user.model');


exports.createPost = async (req, res) => {
    const { content, image, points,id,category} = req.body;

    const post = await Post.create({
        content,
        image,
        author: id,
        category,
    });

    // Increment points if provided
    if (points && Number(points) > 0) {
        await User.findByIdAndUpdate(
            id,
            { $inc: { point: Number(points) } },
            { new: true }
        );
    }

    await post.populate('author', 'name email profilePicture');

    res.status(201).json({
        status: 'success',
        data: post,
    });
};

exports.getPosts = async (req, res) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate('author', 'name email profilePicture')
        .populate('likes');
  
      const total = await Post.countDocuments();
  
      return res.status(200).json({
        status: 'success',
        results: posts.length,
        total,
        data: posts,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: 'error',
        message: 'Server error fetching posts',
      });
    }
  };
  

exports.getPost = async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate('author', 'name email profilePicture')
        .populate('likes');

    if (!post) {
        return res.status(404).json({
            status: 'fail',
            message: 'Post not found',
        });
    }

    return res.status(200).json({
        status: 'success',
        data: post,
    });
};

exports.updatePost = async (req, res) => {
    const { content, image } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({
            status: 'fail',
            message: 'Post not found',
        });
    }

    if (post.author.toString() !== req.user.id) {
        return res.status(403).json({
            status: 'fail',
            message: 'You can only update your own posts',
        });
    }

    post.content = content || post.content;
    if (image !== undefined) {
        post.image = image;
    }

    await post.save();
    await post.populate('author', 'name email profilePicture');

    res.status(200).json({
        status: 'success',
        data: post,
    });
};

exports.deletePost = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({
            status: 'fail',
            message: 'Post not found',
        });
    }

    await post.deleteOne();

    return res.status(204).json({
        status: 'success',
        data: null,
    });
};

