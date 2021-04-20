module.exports = () => {
    var route = require('express').Router();
    var conn = require('../../config/mysql/db')();
    route.get('/add', (req, res) => {
        var sql = 'SELECT id,title FROM topic';
        conn.query(sql, (err, topics, fields) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error - add');
            } else {
                res.render('topic/add', {
                    topics: topics,
                    user: req.user,
                });
            }
        });
    });

    route.post('/add', (req, res) => {
        var title = req.body.title;
        var description = req.body.description;
        var author = req.body.author;
        var sql =
            'INSERT INTO topic (title, description, author) VALUES (?, ?, ?)';
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

    route.get(['/:id/edit'], (req, res) => {
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
                        res.render('topic/edit', {
                            topics: topics,
                            topic: topic[0],
                            user: req.user,
                        });
                    }
                });
            } else {
                console.log('There is no id.');
                res.status(500).send('Internal Server Error');
            }
        });
    });

    route.post(['/:id/edit'], (req, res) => {
        var title = req.body.title;
        var description = req.body.description;
        var author = req.body.author;
        var id = req.params.id;
        var sql =
            'UPDATE topic SET title=?, description=?, author=? WHERE id = ?';
        conn.query(
            sql,
            [title, description, author, id],
            (err, result, fields) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.redirect('/topic/' + id);
                }
            }
        );
    });

    route.get(['/:id/delete'], (req, res) => {
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
                        res.render('topic/delete', {
                            topics: topics,
                            topic: topic[0],
                            user: req.user,
                        });
                    }
                }
            });
        });
    });

    route.post(['/:id/delete'], (req, res) => {
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

    route.get(['/', '/:id'], (req, res) => {
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
                        res.render('topic/view', {
                            topics: topics,
                            topic: topic[0],
                            user: req.user,
                        });
                    }
                });
            } else {
                res.render('topic/view', {
                    topics: topics,
                    user: req.user,
                });
            }
        });
    });

    return route;
};
