const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const app = express();
// app.set('trust proxy', 1); // trust first proxy
app.use(
    session({
        secret: 'kingwangjjang',
        resave: false,
        saveUninitialized: true,
        // cookie: { secure: true },
        store: new FileStore(),
    })
);

app.use(express.urlencoded({ extended: true }));

app.get('/count', (req, res) => {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send('count : ' + req.session.count);
});

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
    <ul>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
    </ul>

    `);
    }
});

app.post('/auth/login', (req, res) => {
    var uname = req.body.username;
    var pwd = req.body.password;

    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if (uname === user.username && pwd === user.password) {
            req.session.displayName = user.displayName;
            return req.session.save(() => {
                res.redirect('/welcome');
            });
        }
    }
    res.send('Who are you? <a href="/auth/login">login</a>');
});

var users = [
    {
        username: 'egoing',
        password: '111',
        displayName: 'Egoing',
    },
];

app.post('/auth/register', (req, res) => {
    var user = {
        username: req.body.username,
        password: req.body.password,
        displayName: req.body.displayName,
    };
    users.push(user);
    req.session.displayName = req.body.displayName;
    req.session.save(() => {
        res.redirect('/welcome');
    });
});

app.get('/auth/register', (req, res) => {
    var output = `
    <h1>Register</h1>
    <form action="/auth/register" method="post">
        <input type="text" placeholder="username" name="username">
        <p>
        <input type="password" placeholder="password" name="password">
        <p>
        <input type="text" placeholder="displayName" name="displayName">
        <p>
        <input type="submit">
    </form>
    `;
    res.send(output);
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

app.listen(3003, () => {
    console.log('connected http://localhost:3003 !!');
});
