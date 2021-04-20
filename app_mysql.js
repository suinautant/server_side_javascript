const app = require('./config/mysql/express')();
const passport = require('./config/mysql/passport')(app);
const auth = require('./routes/mysql/auth')(passport);
app.use('/auth', auth);

var topic = require('./routes/mysql/topic')();
app.use('/topic', topic);

app.listen(3000, () => {
    console.log('Connected, http://localhost:3000/');
});
