module.exports = function (passport) {
    const conn = require('../../config/mysql/db')();
    const bkfd2Password = require('pbkdf2-password');
    const hasher = bkfd2Password();
    const route = require('express').Router();

    route.get('/logout', (req, res) => {
        req.logout();
        req.session.save(() => {
            res.redirect('/welcome');
        });
    });

    route.post(
        '/login',
        passport.authenticate('local', {
            successRedirect: '/welcome',
            failureRedirect: '/auth/login',
            failureFlash: false,
        })
    );

    route.get(
        '/facebook',
        passport.authenticate('facebook', { scope: 'email' })
    );

    route.get(
        '/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/welcome',
            failureRedirect: '/auth/login',
        })
    );

    route.post('/register', (req, res) => {
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

    route.get('/register', (req, res) => {
        res.render('auth/register');
    });

    route.get('/login', (req, res) => {
        res.render('auth/login');
    });

    return route;
};
