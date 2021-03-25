const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
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

app.get('/logout', (req, res) => {
    req.session.login = false;
    res.redirect('/auth/login');
});

app.post('/welcome', (req, res) => {
    var output = '';
    if (
        req.body.user_id == req.session.user_id &&
        req.body.user_pw == req.session.user_pw
    ) {
        req.session.login = true;
    } else {
        req.session.login = false;
    }

    if (req.session.login) {
        output = `<h1>Welcome</h1>
        Hi ${req.session.user_id}
        <h2><a href="/logout">Logout</a></h2>
        `;
    } else {
        output = `<h1>Welcome</h1>
        Valid User login please
        <h2><a href="/auth/login">Login</a></h2>
        `;
    }

    output = `${output}<p>
    req.body.user_id = ${req.body.user_id}<p>
    req.body.user_pw = ${req.body.user_pw}<p>
    req.session.user_id = ${req.session.user_id}<p>
    req.session.user_pw = ${req.session.user_pw}
    `;

    res.send(output);
});

app.get('/welcome', (req, res) => {
    res.send('welcome');
});

app.get('/auth/login', (req, res) => {
    req.session.user_id = 'egoing';
    req.session.user_pw = '12345';
    output = `
    <h1>Login</h1>
    <form action="/welcome" method="post">
        <input type="text" placeholder="user name" name="user_id">
        <p>
        <input type="password" placeholder="password" name="user_pw">
        <p>
        <input type="submit" value="submit">
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
