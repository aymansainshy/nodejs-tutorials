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
router.get('/posts/:postId', feedController.getPost);



// @desc
// POST { /feed/post } create Posts endpoint 
router.post('/post',
    [
        body('title').trim().isLength({ min: 5 }),
        body('content').trim().isLength({ min: 5 }),
    ]
    , feedController.createPost);



// @desc
// PUT { /feed/post/:postId } create Posts endpoint   
router.put('/posts/:postId',
    [
        body('title').trim().isLength({ min: 5 }),
        body('content').trim().isLength({ min: 5 }),
    ]
    , feedController.updatePost);



// @desc
// DELETE { /feed/post/:postId } Delete single post endpoint  
router.delete('/posts/:postId', feedController.deletePost);


module.exports = router;   