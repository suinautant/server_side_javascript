const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.set('views', './views');
app.locals.pretty = true;
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/topic/:id', (req, res) => {
    var topics = ['JavaScript is...', 'Nodejs Is...', 'Express is...'];
    var str = `
    <a href="/topic/0">JavaScript</a><br> 
    <a href="/topic/1">Nodejs</a><br> 
    <a href="/topic/2">Express</a><br> 
    `;
    var output = str + topics[req.params.id];
    res.send(output);
});

app.get('/topic/:id/:mode', (req, res) => {
    res.send(req.params.id + ',' + req.params.mode);
});

app.get('/template', (req, res) => {
    res.render('temp', { time: Date(), title: 'Jade' });
});

app.get('/dynamic', (req, res) => {
    var time = Date();

    var lis = '';
    for (var i = 0; i < 5; i++) {
        lis = lis + '<li>Coding</li>';
    }

    var output = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    <body>
        Hello, dynamic !!
        <ul>
        ${lis}
        </ul>
        ${time}
    </body>
    </html>`;
    res.send(output);
});

app.get('/route', (req, res) => {
    res.send('Hello Router, <img src="/route.png">');
});

app.get('/login', (req, res) => {
    res.send('<h1>Login Page</h1>');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
