const express = require('express');
const { body } = require('express-validator');

const router = express.Router();
const feedController = require('../controllers/feed');

// @desc
// GET { /feed/post } Posts endpoint 
router.get('/posts', feedController.getPosts);


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


module.exports = router;   