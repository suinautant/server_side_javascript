module.exports = function () {
    const express = require('express');
    const session = require('express-session');
    const MySQLStore = require('express-mysql-session')(session);
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
    app.use(express.urlencoded({ extended: true }));

    app.set('views', './views/mysql');
    app.set('view engine', 'pug');

    return app;
};
