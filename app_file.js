var express = require('express');
var fs = require('fs');

var app = express();

app.set('views', './views_file');
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.locals.pretty = true;

app.get(['/topic', '/topic/:id'], (req, res) => {
    var filePath = './data/';

    fs.readdir(filePath, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
        var id = req.params.id;
        if (id) {
            // id 값 없을 때
            fs.readFile('data/' + id, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                }
                res.render('view', {
                    title: id,
                    description: data,
                    topics: files,
                });
            });
        } else {
            // id 값 없을 때
            res.render('view', {
                title: 'Welcome',
                description: 'Hello Javascript for server',
                topics: files,
            });
        }
    });
});

app.post('/topic', (req, res) => {
    var filePath = './data/';
    var fileName = filePath + req.body.title;
    var fileDescription = req.body.description;

    fs.writeFile(fileName, fileDescription, (err) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.redirect('/topic/' + req.body.title);
    });
});

app.get('/new', (req, res) => {
    fs.readdir('data', (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error - new');
        }
        res.render('new', { topics: files });
    });
});

app.listen(3000, () => {
    console.log('Connected, http://localhost:3000/');
});
