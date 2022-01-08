const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        require: true,
    },

    password: {
        type: String,
        require: true,
    },

    name: {
        type: String,
        require: true,
    },

    status: {
        type: String,
        default: "I am new",
    },
    
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post"
        },
    ],
});



const User = mongoose.model('User', userSchema);

module.exports = User;