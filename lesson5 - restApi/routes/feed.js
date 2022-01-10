const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

// @desc
// GET { /feed/post } Posts endpoint 
router.get('/posts', isAuth, feedController.getPosts);



// @desc
// GET { /feed/post:id } Single Post endpoint 
router.get('/posts/:postId', isAuth, feedController.getSinglePost);



// @desc
// POST { /feed/post } create Posts endpoint 
router.post('/post',
    [
        body('title').trim().isLength({ min: 5 }),
        body('content').trim().isLength({ min: 5 }),
    ]
    , isAuth, feedController.createPost);



// @desc
// PUT { /feed/post/:postId } Edit Post endpoint   
router.put('/posts/:postId', isAuth,
    [
        body('title').trim().isLength({ min: 5 }),
        body('content').trim().isLength({ min: 5 }),
    ]
    , feedController.updatePost);



// @desc
// DELETE { /feed/post/:postId } Delete single post endpoint  
router.delete('/posts/:postId', isAuth, feedController.deletePost);


module.exports = router;   