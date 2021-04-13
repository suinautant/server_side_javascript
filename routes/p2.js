module.exports = function (app) {
    const express = require('express');
    const route = express.Router();

    route.get('/r1', (req, res) => {
        res.send('Hello /p2/r1');
    });
    route.get('/r2', (req, res) => {
        res.send('Hello /p2/r2');
    });
    return route;
};
