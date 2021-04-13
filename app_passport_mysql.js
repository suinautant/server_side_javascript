const app = require('./config/mysql/express')();
const passport = require('./config/mysql/passport')(app);

app.get('/welcome', (req, res) => {
    if (req.user && req.user.displayName) {
        res.send(`
            <h1> Hello, ${req.user.displayName}</h1> 
            <a href="/auth/logout">Logout</a>
            `);
    } else {
        res.send(`
            <h1>Welcome</h1>
            <ul>
                <li><a href="/auth/login">Login</a></li>
                <li><a href="/auth/register">Register</a></li>
            </ul>

            `);
    }
});

const auth = require('./routes/mysql/auth')(passport);
app.use('/auth', auth);

app.listen(3003, () => {
    console.log('connected http://localhost:3003 !!');
});
