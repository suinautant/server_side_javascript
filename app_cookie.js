const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

// 삭제 기능 추가 할 것

var products = {
    1: { title: 'The history of web' },
    2: { title: 'The next web' },
};

app.get('/products', (req, res) => {
    var output = '';
    for (var name in products) {
        output += `
        <li>
            <a href="/cart/${name}">${products[name].title}</a>
        </li>
        `;
    }
    output = `
    <h1>Products</h1>
    <ul>
        ${output}
    </ul>
    <h2><a href="/cart">Cart</a></h2>
    `;
    res.send(output);
});

app.get('/cart/:id', (req, res) => {
    var id = req.params.id;

    if (req.cookies.cart) {
        var cart = req.cookies.cart;
    } else {
        var cart = {};
    }

    if (!cart[id]) {
        cart[id] = 0;
    }
    cart[id] = parseInt(cart[id]) + 1;
    res.cookie('cart', cart);
    res.redirect('/cart');
});

app.get('/cart', (req, res) => {
    var output = '';
    if (req.cookies.cart) {
        var cart = req.cookies.cart;

        for (var name in products) {
            if (cart[name]) {
                output += `
                    <li>${products[name].title} : ${cart[name]} <a href="/del/${name}">delete</a></li>
                `;
            }
        }
    } else {
        res.send('Empty');
    }
    output = `
    <h1>Cart</h1>
    ${output}
    <h2><a href="/products">Products</a></h2>
    `;
    res.send(output);
});

app.get('/del/:id', (req, res) => {
    var id = req.params.id;
    var cart = req.cookies.cart;
    cart[id] = null;

    res.cookie('cart', cart);
    res.redirect('/cart');
});

app.get('/count', (req, res) => {
    if (req.cookies.count) {
        var count = parseInt(req.cookies.count);
    } else {
        var count = 0;
    }
    count = count + 1;

    res.cookie('count', count);
    res.send('count : ' + count);
});

app.listen(3003, () => {
    console.log('connected http://localhost:3003 !!');
});
