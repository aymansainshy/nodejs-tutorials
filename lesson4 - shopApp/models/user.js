
const mongodb = require('mongodb');
const { getDb } = require('../utils/database');

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this._id = id;
        this.cart = cart; // {items : []}
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this)
            .then(result => {
                console.log(result);
            }).catch(err => {
                console.log(err);
            });
    }


    addToCart(product) {

        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });

        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];


        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;

        } else {
            updatedCartItems.push({
                productId: new ObjectId(product._id),
                quantity: newQuantity
            });
        }

        const updatedCart = {
            items: updatedCartItems
        }

        const db = getDb();
        return db.collection('users').updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: updatedCart } }
        );
    }



    async addOrder() {
        const db = getDb();
        const cartProducts = await this.getCart()

        const order = {
            items: cartProducts,
            user: {
                _id: new ObjectId(this._id),
                name: this.name,
                email: this.email,
            }
        };

        const result = await db.collection('orders').insertOne(order);

        console.log(`New Order added ..` + result);
        console.log(result);
        this.cart = { items: [] };

        return db.collection('users').updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
        );

    }



    async getOrders() {
        const db = getDb();
        const orders = await db.collection('orders').find({ 'user._id': new ObjectId(this._id) }).toArray();
        return orders;
    }



    async getCart() {
        const db = getDb();

        // List of all products ids ...
        const productsIds = this.cart.items.map(i => {
            return i.productId;
        });

        try {
            const cartProducts = await db.collection('products').find({ _id: { $in: productsIds } }).toArray();

            const convertedCartProducts = cartProducts.map(p => {

                const productQuantity = this.cart.items.find(i => {
                    return i.productId.toString() === p._id.toString();
                }).quantity;

                // New object from product include quantity ...
                return {
                    ...p,
                    quantity: productQuantity,
                }
            });

            return convertedCartProducts;
        } catch (err) {
            console.log(err);
        }

        //     .then(products => {
        //     return products.map(p => {
        //         return {
        //             ...p,
        //             quantity: this.cart.items.find(i => {
        //                 return i.productId.toString() === p._id.toString();
        //             }).quantity,
        //         };
        //     })
        // }).catch(err => {
        //     console.log(err);
        // });
    }


    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });

        const db = getDb();
        return db.collection('users').updateOne(
            { _id: new ObjectId(this._id) },
            {
                $set: {
                    cart: { items: updatedCartItems }
                }
            }
        );

    }


    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new ObjectId(userId) })
            .then(user => {
                console.log(user);
                return user;
            }).catch(err => {
                console.log(err);
            });

    }
}


module.exports = User;
