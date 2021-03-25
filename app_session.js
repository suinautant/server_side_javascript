const express = require('express');
const session = require('express-session');
const app = express();
// app.set('trust proxy', 1); // trust first proxy
app.use(
    session({
        secret: 'kingwangjjang',
        resave: false,
        saveUninitialized: true,
        // cookie: { secure: true },
    })
);
app.use(express.urlencoded({ extended: true }));

app.get('/auth/logout', (req, res) => {
    delete req.session.displayName;
    res.redirect('/welcome');
});

app.get('/welcome', (req, res) => {
    if (req.session.displayName) {
        res.send(`
        <h1> Hello, ${req.session.displayName}</h1> 
        <a href="/auth/logout">Logout</a>
        `);
    } else {
        res.send(`
        <h1>Welcome</h1>
        <a href="/auth/login">Login</a>
        `);
    }
});

app.post('/auth/login', (req, res) => {
    var user = {
        username: 'egoing',
        password: '111',
        displayName: '',
    };
    var uname = req.body.username;
    var pwd = req.body.password;
    if (uname === user.username && pwd === user.password) {
        req.session.displayName = user.displayName;
        res.redirect('/welcome');
    } else {
        res.send('Who are you? <a href="/auth/login">login</a>');
    }
});

app.get('/auth/login', (req, res) => {
    output = `
    <h1>Login</h1>
    <form action="/auth/login" method="post">
        <input type="text" placeholder="username" name="username">
        <p>
        <input type="password" placeholder="password" name="password">
        <p>
        <input type="submit">
    </form>
    `;
    res.send(output);
});

app.get('/count', (req, res) => {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send('count : ' + req.session.count);
});

app.listen(3003, () => {
    console.log('connected http://localhost:3003 !!');
});
