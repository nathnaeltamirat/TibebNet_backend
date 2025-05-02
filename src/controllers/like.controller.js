const Like = require('../models/like.model');
const Post = require('../models/post.model');

// Toggle Like (like/unlike a post)
exports.toggleLike = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
        return res.status(404).json({
            status: 'fail',
            message: 'Post not found'
        });
    }

    // Check if user has already liked the post
    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
        // Unlike the post
        await Like.deleteOne({ _id: existingLike._id });
        await Post.findByIdAndUpdate(postId, { $pull: { likes: existingLike._id } });

        res.status(200).json({
            status: 'success',
            message: 'Post unliked successfully',
            liked: false
        });
    } else {
        // Like the post
        const newLike = await Like.create({
            user: userId,
            post: postId
        });

        await Post.findByIdAndUpdate(postId, { $push: { likes: newLike._id } });

        res.status(201).json({
            status: 'success',
            message: 'Post liked successfully',
            liked: true,
            data: newLike
        });
    }
};

// Get Likes for a specific post
exports.getLikes = async (req, res) => {
    const { postId } = req.params;

    const likes = await Like.find({ post: postId })
        .populate('user', 'name email profilePicture');

    res.status(200).json({
        status: 'success',
        results: likes.length,
        data: likes
    });
};
