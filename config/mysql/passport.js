module.exports = function (app) {
    const conn = require('./db')();
    const bkfd2Password = require('pbkdf2-password');
    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;
    const FacebookStrategy = require('passport-facebook').Strategy;
    const hasher = bkfd2Password();

    app.use(passport.initialize());
    app.use(passport.session());

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

    return passport;
};
