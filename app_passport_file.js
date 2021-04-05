const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bkfd2Password = require('pbkdf2-password');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
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

var users = [
    {
        authId: 'local:egoing',
        username: 'egoing',
        password: '111',
        salt: 'sdlkfjsldkf',
        displayName: 'Egoing',
    },
];

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
    done(null, user.authId);
});

passport.deserializeUser(function (id, done) {
    console.log('deserializeUser', id);
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if (user.authId === id) {
            return done(null, user);
        }
    }
    done('There is no user');
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

passport.use(
    new FacebookStrategy(
        {
            clientID: '196222458705468',
            clientSecret: 'MUST_INPUT_KEY',
            callbackURL: '/auth/facebook/callback',
            profileFields: [
                'id',
                'email',
                'gender',
                'link',
                'locale',
                'name',
                'timezone',
                'updated_time',
                'verified',
                'displayName',
            ],
        },
        function (accessToken, refreshToken, profile, done) {
            console.log(profile);
            var authId = 'facebook:' + profile.id;
            for (var i = 0; i << users.length; i++) {
                var user = users[i];
                if (user.authId === authId) {
                    return done(null, user);
                }
            }
            var newuser = {
                authId: authId,
                displayName: profile.displayName,
                email: profile.emails[0].value,
            };
            users.push(newuser);
            done(null, newuser);
        }
    )
);

app.post(
    '/auth/login',
    passport.authenticate('local', {
        successRedirect: '/welcome',
        failureRedirect: '/auth/login',
        failureFlash: false,
    })
);

app.get(
    '/auth/facebook',
    passport.authenticate('facebook', { scope: 'email' })
);

app.get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/welcome',
        failureRedirect: '/auth/login',
    })
);

app.post('/auth/register', (req, res) => {
    hasher({ password: req.body.password }, (err, pass, salt, hash) => {
        var user = {
            authId: 'local:' + req.body.username,
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
    <a href="/auth/facebook">facebook</a>
    `;
    res.send(output);
});

app.listen(3003, () => {
    console.log('connected http://localhost:3003 !!');
});
