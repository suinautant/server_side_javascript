const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
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
        store: new MySQLStore({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '12345',
            database: 'o2',
        }),
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'o2',
});
conn.connect();

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
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, id, (err, results) => {
        if (err) {
            console.log(err);
            done('There is no user.');
        } else {
            done(null, results[0]);
        }
    });
});

passport.use(
    new LocalStrategy(function (username, password, done) {
        var uname = username;
        var pwd = password;
        var sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, ['local:' + uname], (err, results) => {
            console.log(results);
            if (err) {
                return done('There is no user.');
            }
            var user = results[0];
            return hasher(
                { password: pwd, salt: user.salt },
                (err, pass, salt, hash) => {
                    if (hash === user.password) {
                        console.log('LocalStrategy', user);
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                }
            );
        });
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
            var sql = 'SELECT * FROM users WHERE authId=?';
            conn.query(sql, authId, (err, results) => {
                if (results.length > 0) {
                    done(null, results[0]);
                } else {
                    var newuser = {
                        authId: authId,
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                    };
                    var sql = 'INSERT INTO users SET ?';
                    conn.query(sql, newuser, (err, results) => {
                        if (err) {
                            console.log(err);
                            done('Error');
                        } else {
                            done(null, newuser);
                        }
                    });
                }
            });
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
            salt: salt,
            displayName: req.body.displayName,
        };
        var sql = 'INSERT INTO users SET ?';
        conn.query(sql, user, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500);
            } else {
                req.login(user, (err) => {
                    req.session.save(() => {
                        res.redirect('/welcome');
                    });
                });
            }
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
