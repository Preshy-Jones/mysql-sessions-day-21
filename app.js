const express = require('express');
const mysql = require('mysql');
const ejs = require('ejs');
const session = require('express-session');
const port = process.env.PORT || 8007

//mysql://bfc148d01d2b40:eee07c6c@us-cdbr-east-06.cleardb.net/heroku_5b4be569d534dc8?reconnect=true
const app = express();

const bodyParser = require('body-parser');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365
    }
}));

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.use('/', require('./routes/auth'))
// app.use('/', require('./routes/index'));
// app.use('/api/url', require('./routes/url'));


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
