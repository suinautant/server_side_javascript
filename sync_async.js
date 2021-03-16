var fs = require('fs');

// Sync
console.log('sync');
var data = fs.readFileSync('data.txt', { encoding: 'utf8' });
console.log(data);

// Async
console.log('async');
fs.readFile('data.txt', { encoding: 'utf8' }, (err, data) => {
    if (err) throw err;
    console.log(data);
});
