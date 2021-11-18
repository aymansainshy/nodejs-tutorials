const express = require('express');
const path = require('path');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');
const sequelize = require('./utils/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

  
app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    User.findById(1).then(user => {
        req.user = user;
        next();
    }).catch(err => console.log(err));
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404Page);


Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem }); // Optional
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem }); // Optional


sequelize
    // .sync({ force: true })
    .sync()
    .then((result) => {
        // console.log(result);
        return User.findById(1);
    }).then(user => {
        if (!user) {
            return User.create({ name: "Ayman", email: 'test@test.com' });
        }
        return Promise.resolve(user);
    }).then(user => {
        // console.log(user);
        return user.createCart();
    }).then(cart => {
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });

