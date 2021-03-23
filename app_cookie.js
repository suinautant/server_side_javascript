const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

app.get('/count', (req, res) => {
    if (req.cookies.count) {
        var count = parseInt(req.cookies.count);
    } else {
        var count = 0;
    }
    count = count + 1;

    res.cookie('count', count);
    res.send('count : ' + count);
});

app.listen(3003, () => {
    console.log('connected http://localhost:3003 !!');
});
