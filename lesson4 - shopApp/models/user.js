const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        items: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
        }]
    }
});


// @desc
// Add item to cart 
userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.product.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];


    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;

    } else {
        updatedCartItems.push({
            product: product,
            quantity: newQuantity
        });
    }

    const updatedCart = {
        items: updatedCartItems
    }

    this.cart = updatedCart;
    return this.save();
}


// @desc
// Delete item from cart 
userSchema.methods.deleteItemFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.product.toString() !== productId.toString();
    });

    this.cart.items = updatedCartItems;
    return this.save();
}



// @desc
// Clear Cart after order done . Windows
userSchema.methods.clearCart = function() {
    this.cart = { item: [] };
    return this.save();
}



const User = mongoose.model('User', userSchema);

module.exports = User;