const express = require('express');
const { auth } = require('../middlewares/auth');
const postController = require('../controllers/post.controller');
const likeController = require('../controllers/like.controller');

const router = express.Router();

// Post routes
router.post('/', auth, postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.patch('/:id', auth, postController.updatePost);
router.delete('/:id', auth, postController.deletePost);

// Like routes
router.post('/:postId/like', auth, likeController.toggleLike);
router.get('/:postId/likes', likeController.getLikes);

module.exports = router; 