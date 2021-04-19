var express = require('express');
var fs = require('fs');
var app = express();
app.set('views', './views_mysql');
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'o2',
});
conn.connect();

app.locals.pretty = true;

app.post('/topic/add', (req, res) => {
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'INSERT INTO topic (title, description, author) VALUES (?, ?, ?)';
    conn.query(sql, [title, description, author], (err, result, fields) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            // res.send(rows);
            res.redirect('/topic/' + result.insertId);
        }
    });
});

app.post(['/topic/:id/edit'], (req, res) => {
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var id = req.params.id;
    var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id = ?';
    conn.query(sql, [title, description, author, id], (err, result, fields) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/topic/' + id);
        }
    });
});

app.post(['/topic/:id/delete'], (req, res) => {
    var id = req.params.id;
    var sql = 'DELETE FROM topic WHERE id = ?';
    conn.query(sql, [id], (err, result, fields) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/topic/');
        }
    });
});

app.get(['/topic/:id/delete'], (req, res) => {
    var sql = 'SELECT id,title FROM topic';
    var id = req.params.id;
    conn.query(sql, (err, topics, fields) => {
        var sql = 'SELECT * FROM topic WHERE id=?';
        conn.query(sql, [id], (err, topic, fields) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                if (topic.length === 0) {
                    console.log('There is no id.');
                    res.status(500).send('Internal Server Error');
                } else {
                    res.render('delete', {
                        topics: topics,
                        topic: topic[0],
                    });
                }
            }
        });
    });
});

app.get(['/topic/:id/edit'], (req, res) => {
    var sql = 'SELECT id,title FROM topic';
    conn.query(sql, (err, topics, fields) => {
        var id = req.params.id;
        if (id) {
            var sql = 'SELECT * FROM topic WHERE id=?';
            conn.query(sql, [id], (err, topic, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.render('edit', {
                        topics: topics,
                        topic: topic[0],
                    });
                }
            });
        } else {
            console.log('There is no id.');
            res.status(500).send('Internal Server Error');
        }
    });
});

app.get(['/topic', '/topic/:id'], (req, res) => {
    var sql = 'SELECT id,title FROM topic';
    conn.query(sql, (err, topics, fields) => {
        var id = req.params.id;
        if (id) {
            var sql = 'SELECT * FROM topic WHERE id=?';
            conn.query(sql, [id], (err, topic, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.render('view', {
                        topics: topics,
                        topic: topic[0],
                    });
                }
            });
        } else {
            res.render('view', {
                topics: topics,
            });
        }
    });
});

app.get('/add', (req, res) => {
    var sql = 'SELECT id,title FROM topic';
    conn.query(sql, (err, topics, fields) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error - add');
        } else {
            res.render('add', {
                topics: topics,
            });
        }
    });
});

app.listen(3000, () => {
    console.log('Connected, http://localhost:3000/');
});
