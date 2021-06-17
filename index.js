const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult, sanitizeBody, check, oneOf } = require('express-validator');
const multer = require('multer');
//File Uploading need to reroute to db
var upload = multer({ dest: 'uploads/' });
const app = express()
const port = 3000;


// =========== MSSQL INFORMATION ===========
const sql = require('mssql')

const sqlConfig = {
    user: 'RefundAuth',
    password: 'notgonnausethis',
    database: 'ProjectDigitise',
    server: 'notcreative.co.uk',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

// ==========================================

app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/public/')); // Assets go in the public folder.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/application', async(req, res) => { // The applicant applies here for the refund.
    res.render('application.html');
    try {
        await sql.connect(sqlConfig)
        console.log(sql.query(`select * from refunds`))
        console.log("Success")
    } catch (error) {
        console.log(error)
    }
    console.log(`Viewing: Application`);
})

app.get('/', (req, res) => {
    res.redirect(`application`);
    console.log(`Landing here, redirecting to -> application`);
})


// @TODO Add in functionality for email to be sent
app.post('/application',
    //@TODO Form Validation using ExpressValidatior


    //File Uploading
    upload.single('ref-notice-file'),

    //@portal-transfer validation
    body('ref-first-name').trim().escape().isLength({ min: 1 }).withMessage('Empty first name').isAlpha().withMessage('First name must contain alphabet letters'),
    body('ref-last-name').trim().escape().isLength({ min: 1 }).withMessage('Empty last name').isAlpha().withMessage('Last name must contain alphabet letters'),
    body('student-number').trim().escape().isLength({ min: 7, max: 7 }).withMessage('Student number must be 7 digits').isNumeric().withMessage('Content must not contain alphabetic letters'),

    //@portal-extra validation
    body('ref-payer-first-name').optional({ checkFalsy: true }).trim().escape().isLength({ min: 1 }).withMessage('Empty first name').isAlpha().withMessage('First name must contain alphabet letters'),
    body('ref-payer-last-name').optional({ checkFalsy: true }).trim().escape().isLength({ min: 1 }).withMessage('Empty last name').isAlpha().withMessage('Last name must contain alphabet letters'),
    body('ref-payer-address').optional({ checkFalsy: true }).escape().isLength({ min: 1 }).withMessage('Address must be filled in'),

    //@international-transfer validation @TODO finish validation for this part
    body('ref-acc-name-it').optional({ checkFalsy: true }).trim().escape().isLength({ min: 1 }).withMessage('Empty account name').isAlpha().withMessage('must contain alphabet letters'),
    body('ref-acc-num-it').optional({ checkFalsy: true }).trim().escape().isIBAN().withMessage('This is not a valid IBAN number'),
    body('ref-swift-code-it').optional({ checkFalsy: true }).trim().escape().isBIC().withMessage('This is not a valid code'),
    body('ref-bank-name-it').optional({ checkFalsy: true }).trim().escape().isAlpha().withMessage('Please only use alphabetic characters'),
    body('ref-bank-address-it').optional({ checkFalsy: true }).escape().isAlphanumeric().withMessage('Please do not use any symbols'),

    //@home-transfer validation
    body('ref-acc-name-ht').optional({ checkFalsy: true }).escape().isLength({ min: 1 }).withMessage('Empty account name').isAlpha().withMessage('must contain alphabet letters'),
    body('ref-acc-num-ht').optional({ checkFalsy: true }).trim().escape().isLength({ min: 8, max: 8 }).withMessage('Account Number must be 8 digits long').isNumeric().withMessage('Must only use numbers'),
    check('ref-sort-code-ht').optional({ checkFalsy: true }).escape().isNumeric().withMessage('Must only contain digits'),

    //@portal-extra2 validation
    body('ref-reason').optional({ checkFalsy: true }).trim().escape().isAlphanumeric().withMessage('Text may only contain alphanumeric characters'),
    body('ref-ex-reason').optional({ checkFalsy: true }).trim().escape().isAlphanumeric().withMessage('Text may only contain alphanumeric characters'),
    body('t/c-accepted').toBoolean(),

    (req, res) => {
        const errors = validationResult(req);
        //console.log(errors);  
        console.log(req.body['ref-first-name']);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            res.redirect('application');

        } else {
            console.log("Free of errors insert into database")

            //@TODO Create sql query that inserts into the database

            console.log("Application Recieved Send email");

            //@TODO look into node email
            res.redirect('application');
        }

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