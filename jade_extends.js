const express = require('express');
const app = express();
app.set('view engine', 'pug');
app.set('views', 'views');
app.get('/view', (req, res) => {
    res.render('view');
});
app.get('/add', (req, res) => {
    res.render('add');
});
app.listen(3003, () => {
    console.log('Connect http://localhost:3003/view ');
});
