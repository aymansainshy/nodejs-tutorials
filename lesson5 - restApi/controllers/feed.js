const fs = require('fs');
const { validationResult } = require('express-validator');

const Post = require('../models/post');
const User = require('../models/user');
const io = require('../socket-io');


// @desc 
// GET All Posts Controller ......
exports.getPosts = async (req, res, next) => {

    const currentPage = req.query.page || 1;
    const perPage = 4;

    try {
        // To user implecite Promise user exec();
        const totalItems = await Post.countDocuments().exec();

        const posts = await Post.find()
            .populate('creator')
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.status(200).json({ totalItems: totalItems, posts: posts });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}




// @desc
// GET Single Post Controller ......
exports.getSinglePost = async (req, res, next) => {
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


        // Check if NOT FileAppended
        if (!req.file) {
            const error = new Error('No Image Provided.');
            error.statusCode = 422;
            throw error;
        }

        const imageUrl = req.file.path;
        const title = req.body.title;
        const content = req.body.content;

        const post = Post({
            title: title,
            content: content,
            imageUrl: imageUrl,
            creator: req.userId,
        });

        const result = await post.save();

        const user = await User.findById(req.userId);

        user.posts.push(post);

        await user.save();


        // Sent Socket-io Event ..
        io.getIO().emit('post',
            {
                action: 'create',
                post: {
                    ...post._doc, 
                    creator: {
                        _id: req.userId,
                        name: user.name
                    }
                }
            });

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





// @desc
// [ UPDATE ] Single Post Controller ...........
exports.updatePost = async (req, res, next) => {
    const postId = req.params.postId;

    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        const error = new Error('Validation failed. Entered date incorrect.');
        error.statusCode = 422;
        error.errors = errors.array();
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    // let imageUrl = req.body.imageUrl;

    // if (req.file) {
    //     imageUrl = req.file.path;
    // }

    // if (!imageUrl) {
    //     const error = new Error('No Image Provided.');
    //     error.statusCode = 422;
    //     throw error;
    // }


    try {
        const post = await Post.findById(postId);

        if (!post) {
            const error = new Error("NO POST FOUND");
            error.statusCode = 404;
            throw error;
        }

        if (post.creator.toString() !== req.userId.toString()) {
            const error = new Error("Not Authorized");
            error.statusCode = 403;
            throw error;
        }

        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }

        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        const result = await post.save();

        res.status(201).json({
            message: 'Posts Updated successfully!',
            post: result,
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};



// @desc
// [ DELETE ] Single Post Controller ...........
exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            const error = new Error("NO POST FOUND");
            error.statusCode = 404;
            throw error;
        }

        if (post.creator.toString() !== req.userId.toString()) {
            const error = new Error("Not Authorized");
            error.statusCode = 403;
            throw error;
        }

        // clearImage(post.imageUrl);

        const result = await Post.findByIdAndRemove(postId);

        // clear post from user collection User.posts = [];
        const user = await User.findById(req.userId);
        user.posts.pull(result);
        await user.save();

        res.status(200).json({
            message: 'Posts Delelted successfully!',
        });

    } catch (err) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}



const clearImage = (filePath) => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};