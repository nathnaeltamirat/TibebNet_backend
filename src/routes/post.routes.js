const express = require('express');
const { auth } = require('../middlewares/auth');
const postController = require('../controllers/post.controller');
const likeController = require('../controllers/like.controller');

const router = express.Router();

// Post routes
router
  .route('/')
  .get(postController.getPost)
  .post(postController.createPost);
router
  .route('/one/:id')
  .get(postController.getPost);
router
   .route('/del/:id')
  .delete(postController.deletePost);
router
    .route('/all')
    .get(postController.getPosts)
// router.get('/posts', postController.getPostsByUserId);
// Like routes
// router.post('/:postId/like', auth, likeController.toggleLike);
// router.get('/:postId/likes', likeController.getLikes);

module.exports = router;
