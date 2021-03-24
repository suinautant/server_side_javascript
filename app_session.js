const express = require('express');
const session = require('express-session');
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
