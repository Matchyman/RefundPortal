const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult, sanitizeBody, check, oneOf } = require('express-validator');
const multer = require('multer');
//File Uploading need to reroute to db
var upload = multer({ dest: 'uploads/' });
const app = express()
const port = 3000;


// =========== MSSQL INFORMATION ===========
const sql = require('mssql');
const { request } = require('express');

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

    console.log(`Viewing: Application`);
})

app.get('/', (req, res) => {
    res.redirect(`application`);
    console.log(`Landing here, redirecting to -> application`);
})


// @TODO Add in functionality for email to be sent
app.post('/application',
    //@TODO Form Validation using ExpressValidatior

    /*
    What gets passed through 
    {
  'stu-pay': '',
  'ref-title': '',
  'ref-first-name': '',
  'ref-last-name': '',
  'student-number': '',
  'ref-payer-title': '',
  'ref-payer-first-name': '',
  'ref-payer-last-name': '',
  'ref-payer-address': '',
  'ref-acc-name-it': '',
  'ref-acc-num-it': '',
  'ref-swift-code-it': '',
  'ref-bank-name-it': '',
  'ref-bank-address-it': '',
  'ref-acc-name-ht': '',
  'ref-acc-num-ht': '',
  'ref-sort-code-ht': '',
  'ref-reason': '',
  'ref-ex-reasons': '',
  't/c-accepted': true
    }
    */

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

    async(req, res) => {
        const errors = validationResult(req);
        //console.log(req.body)
        if (!errors.isEmpty()) {
            console.log(errors.array());
            res.redirect('application', { errors: errors });
        } else {
            console.log("Free of errors insert into database")
                //@TODO Create sql query that inserts into the database
            try {
                await sql.connect(sqlConfig)
                const request = new sql.Request()

                request.input('stu_pay', req.body['stu-pay'])
                request.input('title', req.body['ref-title'])
                request.input('first_name', req.body['ref-first-name'])
                request.input('last_name', req.body['ref-last-name'])
                request.input('student_number', req.body['student-number'])

                request.input('payer_title', req.body['ref-payer-title'])
                request.input('payer_first_name', req.body['ref-payer-first-name'])
                request.input('payer_last_name', req.body['ref-payer-last-name'])
                request.input('payer_address', req.body['ref-payer-address'])

                request.input('acc_name_it', req.body['ref-acc-name-it'])
                request.input('acc_num_it', req.body['ref-acc-num-it'])
                request.input('swift_code_it', req.body['ref-swift-code-it'])
                request.input('bank_name_it', req.body['ref-bank-name-it'])
                request.input('bank_address_it', req.body['ref-bank-address-it'])

                request.input('acc_name_ht', req.body['ref-acc-name-ht'])
                request.input('acc_num_ht', req.body['ref-acc-num-ht'])
                request.input('sort_code_ht', req.body['ref-sort-code-ht'])

                request.input('reason', req.body['ref-reason'])
                request.input('ex_reasons', req.body['ref-ex-reasons'])

                request.query('INSERT INTO refunds' +
                    '(pay_type, title, first_name, last_name, student_number,' +
                    'payer_title, payer_first_name, payer_last_name, payer_address,' +
                    'acc_name_it, acc_iban_it, acc_swift_it, acc_bank_name_it, acc_bank_address_it,' +
                    'acc_name_ht, acc_num_ht, acc_sort_code, ref_reason, ref_ex_reason) VALUES' +

                    '(@stu_pay, @title, @first_name,@last_name, @student_number,' +
                    '@payer_title, @payer_first_name, @payer_last_name,@payer_address,' +
                    '@acc_name_it, @acc_num_it, @swift_code_it, @bank_name_it, @bank_address_it,' +
                    '@acc_name_ht, @acc_num_ht, @sort_code_ht, @reason, @ex_reasons);')

            } catch (error) {
                console.log(error)
            }

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