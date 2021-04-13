module.exports = function (app) {
    const express = require('express');
    const route = express.Router();

    route.get('/r1', (req, res) => {
        res.send('Hello /p1/r1');
    });
    route.get('/r2', (req, res) => {
        res.send('Hello /p1/r2');
    });
    app.get('/p3/r1', (req, res) => {
        res.send('Hello /p3/r1');
    });
    return route;
};
