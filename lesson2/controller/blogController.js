const Blog = require('../models/blog.js');


// Mongoose and mongo sanbox routes 
// app.get('/add-blog', (req, res) => {
//     const blog = new Blog({
//         title: "New Blog 33",
//         snippet: "this is from ayman 333",
//         body: " Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet consecteturLorem ipsum dolor sit amet consectetur v",
//     });

//     blog.save().then((result) => {
//         res.send(result)
//     }).catch((err) => {
//         console.log(err)
//     });
// });


const all_blogs = (req, res) => {
    // const blogs = [];
    Blog.find().sort({ createdAt: -1 }).then((blogs) => {
        // result.forEach((blog) => {
        //     blogs.push(blog);
        // });
        // res.send(result); // This here sending result as json ....
        res.render('index', { title: 'Home', blogs });
    }).catch((err) => {
        console.log(err);
    });
}


const blog_create_post = (req, res) => {
    // console.log(req.body);
    const blog = new Blog(req.body);

    blog.save().then((restul) => {
        res.redirect('/blogs')
    }).catch((err) => {
        console.log(err);
    });
}


const blog_create_get = (req, res) => {
    res.render('create', { title: 'create' });
}


const blog_delete = (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id).then((result) => {
        // res.send(result);
        // res.render('details', { title: "details", blog });
        console.log(result);
        // res.redirect('/blogs'); // We can do this to Ajaks requiste....
        res.json({ redirect: '/blogs' });
    }).catch((err) => {
        console.log(err);
    });
}


const blog_details = (req, res) => {
    const id = req.params.id;
    Blog.findById(id).then((blog) => {
        // res.send(result);
        res.render('details', { title: "details", blog });
    }).catch((err) => {
        console.log(err);
        res.status(404).render('404', { title: "Blog not found " });
    });
}


module.exports = {
    all_blogs,
    blog_create_post,
    blog_details,
    blog_delete,
    blog_create_get,
};