module.exports = function (passport) {
    const conn = require('../../config/mysql/db')();
    const bkfd2Password = require('pbkdf2-password');
    const hasher = bkfd2Password();
    const route = require('express').Router();

    route.post(
        '/login',
        passport.authenticate('local', {
            successRedirect: '/topic',
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
            successRedirect: '/topic',
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
                            res.redirect('/topic');
                        });
                    });
                }
            });
        });
    });

    route.get('/register', (req, res) => {
        var sql = 'SELECT id,title FROM topic';
        conn.query(sql, (err, topics, fields) => {
            res.render('auth/register', {
                topics: topics,
            });
        });
    });

    route.get('/login', (req, res) => {
        var sql = 'SELECT id,title FROM topic';
        conn.query(sql, (err, topics, fields) => {
            res.render('auth/login', {
                topics: topics,
            });
        });
    });

    route.get('/logout', (req, res) => {
        req.logout();
        req.session.save(() => {
            res.redirect('/topic');
        });
    });

    return route;
};
