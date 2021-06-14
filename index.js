const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const config = require("./security/db.json");
const app = express()
const port = 3000;

// =========== SQL INFORMATION ============

var pool = mysql.createPool({ // To change the details, change the values in security/db.json
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    multipleStatements: true
});

// ========================================

app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public/')); // Assets go in the public folder.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/application', (req, res) => { // The applicant applies here for the refund.
    res.render('application.html');
    console.log(`Viewing: Application`);
})

app.get('/', (req, res) => {
    res.redirect(`application`);
    console.log(`Landing here, redirecting to -> application`);
})

app.post('/application', (req, res) => { // @TODO Add in functionality for email to be sent
    //console.log(req.body);
    //@TODO Form Validation using ExpressValidatior

    res.redirect('application');
    console.log("Application Recieved Send email")
})

app.get('/login', (req, res) => { // @TODO: Dependant on login/authentication requirements.
    res.render('login.html');
})

app.post('/postLogin', (req, res) => { // @TODO: Dependant on login/authentication requirements.
    console.log(req.body)
    pool.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query(`SELECT * FROM refundAuthentication WHERE userID = '${req.body.username}'`, function(err, result, fields) {
            if (err) throw err;
            // console.log(result[0].userID); // -- Ensuring a valid entry is returned.
            if (result != '') {
                if (req.body.password == result[0].userPassword) {
                    connection.release();
                    res.render('management.html');
                }
            } else {
                connection.release();
                res.redirect('login.html');
            }
        })
    })
})

app.post('/search', (req, res) => { //
    // @TODO: implement search function here once data is acquired.
})

app.listen(port, () => {
    console.log(`Application started @ http://localhost:${port}`)
})