const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', './views_cart_self');
app.locals.pretty = true;

app.get('/cart', (req, res) => {
    var num = req.query.num;
    var action = req.query.action;

    res.send('num : ' + num + ', action : ' + action);

    // if(action = 'add'){
    //     // add list in cart
    //     var cart = [
    //         { num, ${num} },
    //         { action, ${action}}
    //     ];
    // } else if (action = 'del') {
    //     // dele list in cart
    // }
    // res.render('cart');
});

app.get('/product', (req, res) => {
    res.render('product');
});

app.listen(3003);
