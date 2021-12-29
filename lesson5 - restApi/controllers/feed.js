const { validationResult } = require('express-validator');

const Post = require('../models/post');


// @desc
// GET All Posts Controller ......
exports.getPosts = async (req, res, next) => {

    try {
        const posts = await Post.find();
        res.status(200).json({ posts: posts });
        
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }

    // res.status(200).json({
    //     posts: [
    //         {
    //             _id: '1',
    //             title: 'First posts',
    //             content: 'This is the first post',
    //             imageUrl: 'http://localhost/images/1.jpg',
    //             creator: {
    //                 name: 'Ayman Sainshy',
    //             },
    //             createdAt: new Date(),
    //         },
    //     ]
    // });
}




// @desc
// GET Single Post Controller ......
exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId);

        if (!post) {
            const error = new Error("NO POST FOUND");
            error.status = 404;
            throw error;
        }

        res.status(200).json({ post: post });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}





// @desc
// Create Single Post Controller ......
exports.createPost = async (req, res, next) => {
    const errors = validationResult(req);
    try {

        if (!errors.isEmpty()) {
            const error = new Error('Validation failed. Entered date incorrect.');
            error.statusCode = 422;
            error.errors = errors.array();
            throw error;

            // return res.status(422).json({
            //     error: 'Validation failed. entered date incorrect.',
            //     message: errors.array(),
            // })
        }

        const title = req.body.title;
        const content = req.body.content;

        const post = Post({
            title: title,
            content: content,
            imageUrl: 'http://localhost/images/p1.png',
            creator: {
                name: 'Ayman Sainshy',
            },
        });

        const result = await post.save();

        res.status(201).json({
            message: 'Posts created successfully!',
            post: result,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}   