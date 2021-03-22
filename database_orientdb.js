const OrientDB = require('orientjs');

var server = OrientDB({
    host: 'localhost',
    port: 2424,
    username: 'root',
    password: '111111',
    useToken: true,
});

var db = server.use('o2');

/*
db.record.get('#23:0').then(function (record) {
    console.log('Loaded record:', record.title);
});
*/

/*
 * CRUD (query)
 */

sql = 'select * from o2';
db.createQuery();
