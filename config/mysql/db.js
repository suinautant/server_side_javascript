module.exports = function () {
    const mysql = require('mysql');
    const conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345',
        database: 'o2',
    });
    conn.connect();

    return conn;
};
