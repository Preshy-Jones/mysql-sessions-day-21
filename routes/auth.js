const express = require('express')
const mysql = require('mysql');
const request = require('request')

const router = express.Router();


const db = mysql.createConnection({
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'bfc148d01d2b40',
    password: 'eee07c6c',
    database: 'heroku_5b4be569d534dc8'
});
//connect

db.connect((err) => {
    if (err) {
        throw err
    }
    console.log('MySql Connected...');

});


//create db
router.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE preshydb'
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);

        res.send('Database created ...');
    })
})

router.get('/createuserstable', (req, res) => {
    let sql = 'CREATE TABLE Users(id int AUTO_INCREMENT, name VARCHAR(255), username VARCHAR(255), email VARCHAR(255), PRIMARY KEY (id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Users table created....');
    });
});


router.get('/populate', (req, res) => {
    request({
        url: "http://jsonplaceholder.typicode.com/users",
        json: true
    }, (err, resp, body) => {
        //res.send(typeof body);
        for (var i = 0; i < body.length; i++) {

            let post = { id: body[i].id, name: body[i].name, username: body[i].username, email: body[i].email };
            let sql = 'INSERT INTO users SET?';
            let query = db.query(sql, post, (err, result) => {
                if (err) throw err;
                console.log(result);
            });
        };
        res.send('users data added....')
    });

});

router.get('/delete', (req, res) => {
    let sql = "SELECT * FROM users";
    db.query(sql, function (err, result) {
        if (err) throw err;
        let sqls = `DELETE FROM users WHERE id = ${result.length}`;
        let query = db.query(sqls, (err, resul) => {
            if (err) throw err;
            // console.log(resul);
            res.send('user deleted....');

        });

    });

});



router.post('/signup', (req, res) => {
    let user = { name: req.body.name, username: req.body.username, email: req.body.email };
    db.query('INSERT INTO users SET?', user, (error, result) => {
        if (error) throw error;
        res.status(201).send(`User added with ID: ${result.insertId}`);
    });
});

router.get('/home', function (request, response) {
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '!');
    } else {
        response.redirect('/login')
    }
    response.end();
});

router.get('/login', (req, res) => res.render('login'));

router.post('/login', (req, res) => {
    // try {
    //     const { name, email } = req.body;
    //     db.query('SELECT * FROM users WHERE email = ?', [name], async (error, results) => {
    //         if (!results) {
    //             res.send({
    //                 message: "username or email is incorrect"
    //             })
    //         } else {
    //             res.send({
    //                 message: "logged in as " //+ results[0].name
    //             })
    //         }
    //     });
    //     // res.send({ name, email });
    //     // console.log({ name, email });

    // } catch (error) {
    //     console.log(error);

    // }
    var name = req.body.name;
    var email = req.body.email;
    if (name && email) {
        db.query('SELECT * FROM users WHERE name = ? AND email = ?', [name, email], function (error, results, fields) {
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = name;
                res.redirect('/home');
            } else {
                res.send('Incorrect Username and/or Password!');
            }
            res.end();
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
});

// router.get('/adduser', (req, res) => {
//     let post = { id: 1, name: 'neymar', username: 'NMJR', email: 'neymarjr@gmail.com' };
//     let sql = 'INSERT INTO users SET?';
//     let query = db.query(sql, post, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('single user added....');

//     });
// });


// router.get('/addpost1', (req, res) => {
//     let post = { title: 'Post One', body: 'This is post number one' };
//     let sql = 'INSERT INTO posts SET?';
//     let query = db.query(sql, post, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Posts 1 added....');

//     });
// });

// router.get('/addpost2', (req, res) => {
//     let post = { title: 'Post Two', body: 'This is post number two' };
//     let sql = 'INSERT INTO posts SET?';
//     let query = db.query(sql, post, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Posts 2 added....');

//     });
// });


//select users
router.get('/getusers', (req, res) => {
    let sql = 'SELECT * FROM users';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        res.send(results);
        console.log('Users fetched....');
    });
});

// //select single posts
router.get('/getuser/:id', (req, res) => {
    let sql = `SELECT * FROM users WHERE id = ${req.params.id}`;
    let query = db.query(sql, async (err, result) => {
        //     if (err) throw err;
        await result;
        if (!result) {
            res.send('no useer with that id')
        }
    });
});

// //update post
// router.get('/updatepost/:id', (req, res) => {
//     let newTitle = 'Updated Title';
//     let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
//     let query = db.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Post updated....');

//     });
// });

// //delete post
// router.get('/deletepost/:id', (req, res) => {
//     let newTitle = 'Updated Title';
// let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
// let query = db.query(sql, (err, result) => {
//     if (err) throw err;
//     console.log(result);
//     res.send('Post deleted....');

// });
// });

module.exports = router