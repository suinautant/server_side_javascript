const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bkfd2Password = require('pbkdf2-password');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const hasher = bkfd2Password();
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
app.use(passport.initialize());
app.use(passport.session());
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
    req.logout();
    req.session.save(() => {
        res.redirect('/welcome');
    });
});

app.get('/welcome', (req, res) => {
    if (req.user && req.user.displayName) {
        res.send(`
    <h1> Hello, ${req.user.displayName}</h1> 
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

passport.serializeUser(function (user, done) {
    console.log('serializeUser', user);
    done(null, user.username);
});

passport.deserializeUser(function (id, done) {
    console.log('deserializeUser', id);
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if (user.username === id) {
            return done(null, user);
        }
    }
});

passport.use(
    new LocalStrategy(function (username, password, done) {
        var uname = username;
        var pwd = password;

        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            if (uname === user.username) {
                console.log('LocalStrategy', user);
                return hasher(
                    { password: pwd, salt: user.salt },
                    (err, pass, salt, hash) => {
                        if (hash === user.password) {
                            done(null, user);
                            console.log('not valid password');
                        } else {
                            done(null, false);
                            console.log('valid password');
                        }
                    }
                );
            }
        }
        done(null, false);
    })
);

app.post(
    '/auth/login',
    passport.authenticate('local', {
        successRedirect: '/welcome',
        failureRedirect: '/auth/login',
        failureFlash: false,
    })
);

var users = [
    {
        username: 'egoing',
        password: '111',
        salt: 'sdlkfjsldkf',
        displayName: 'Egoing',
    },
];

app.post('/auth/register', (req, res) => {
    hasher({ password: req.body.password }, (err, pass, salt, hash) => {
        var user = {
            username: req.body.username,
            password: hash,
            aslt: salt,
            displayName: req.body.displayName,
        };
        users.push(user);
        req.login(user, (err) => {
            req.session.save(() => {
                res.redirect('/welcome');
            });
        });
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
