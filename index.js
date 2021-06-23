const express = require('express');
const bodyParser = require('body-parser');
const { body, validationResult, sanitizeBody, check, oneOf, query } = require('express-validator');
const multer = require('multer');
let storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express()
const port = 3000;


// =========== MSSQL INFORMATION ===========
const sql = require('mssql');
const { request, application } = require('express');

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
    const errors = []
    res.render('application.html', { 'errors': errors });

    console.log(`Viewing: Application`);
})

app.get('/', (req, res) => {
    res.redirect(`application`);
    console.log(`Landing here, redirecting to -> application`);
})


// @TODO Add in functionality for email to be sent
// @TODO Form Validation using ExpressValidatior
// @TODO need to add insertion of file and if visa has been refused
// @TODO fix sort code 
app.post('/application',
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
    check('ref-acc-name-ht').optional({ checkFalsy: true }).custom((value) => {
        return value.match(/^[A-Za-z ]+$/);
    }).withMessage("Please only use alphabetic letters").escape(),
    body('ref-acc-num-ht').optional({ checkFalsy: true }).trim().escape().isLength({ min: 8, max: 8 }).withMessage('Account Number must be 8 digits long').isNumeric().withMessage('Must only use numbers'),
    check('ref-sort-code-ht').optional({ checkFalsy: true }).escape().isAlphanumeric().withMessage('Must only contain digits'),
    check('ref-sort-code-ht1').optional({ checkFalsy: true }).escape().isAlphanumeric().withMessage('Must only contain digits'),
    check('ref-sort-code-ht2').optional({ checkFalsy: true }).escape().isAlphanumeric().withMessage('Must only contain digits'),

    //@portal-extra2 validation
    body('ref-reason').optional({ checkFalsy: true }).trim().escape().isAlphanumeric().withMessage('Text may only contain alphanumeric characters'),
    //Custom validator for image file
    check('ref-notice-file').optional({ checkFalsy: true }).custom((value, { req }) => {
        if (req.file.mimetype === 'image/png') {
            return '.png';
        } else if (req.file.mimetype === 'image/png') {
            return '.jpeg';
        } else {
            return false;
        }
    }).withMessage("Please only upload png or jpeg documents"),
    body('ref-ex-reason').optional({ checkFalsy: true }).trim().escape().isAlphanumeric().withMessage('Text may only contain alphanumeric characters'),
    body('t/c-accepted').toBoolean(),

    async(req, res) => {
        console.log(req.file);
        const errors = validationResult(req);
        console.log(req.body);

        if (!errors.isEmpty()) {
            //console.log(errors.array());
            res.render('application.html', { errors: errors.array() });
        } else {
            console.log("Free of errors insert into database")
            await sql.connect(sqlConfig)
            const request = new sql.Request()
            request.input('student_number', req.body['student-number'])
            try {

                request.input('stu_pay', req.body['stu-pay'])
                request.input('title', req.body['ref-title'])
                request.input('first_name', req.body['ref-first-name'])
                request.input('last_name', req.body['ref-last-name'])


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
                request.input('sort_code_ht', req.body['ref-sort-code-ht'] + req.body['ref-sort-code-ht1'] + req.body['ref-sort-code-ht2'])

                request.input('reason', req.body['ref-reason'])

                request.input('fileinput', sql.Image, req.file['buffer'])
                request.input('ex_reasons', req.body['ref-ex-reasons'])

                request.query('INSERT INTO refunds' +
                    '(pay_type, title, first_name, last_name, student_number,' +
                    'payer_title, payer_first_name, payer_last_name, payer_address,' +
                    'acc_name_it, acc_iban_it, acc_swift_it, acc_bank_name_it, acc_bank_address_it,' +
                    'acc_name_ht, acc_num_ht, acc_sort_code, ref_reason, visa_ref_file, ref_ex_reason) VALUES' +

                    '(@stu_pay, @title, @first_name,@last_name, @student_number,' +
                    '@payer_title, @payer_first_name, @payer_last_name,@payer_address,' +
                    '@acc_name_it, @acc_num_it, @swift_code_it, @bank_name_it, @bank_address_it,' +
                    '@acc_name_ht, @acc_num_ht, @sort_code_ht, @reason, @fileinput, @ex_reasons);'
                )

            } catch (error) {
                console.log(error)
            }

            console.log("Application Recieved Send email");
            sendEmail();
            res.redirect('application');
        }

    })

app.get('/login', (req, res) => { // @TODO: Dependant on login/authentication requirements.
    res.render('login.html');
})

app.post('/postLogin', async(req, res) => { // @TODO: Dependant on login/authentication requirements.
    //console.log(req.body)
    await sql.connect(sqlConfig)
    const request = new sql.Request()
    request.query('select * from refunds', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render('management.html', { data: result });
        }
    })

    //res.redirect('login.html');

})

//@TODO Implement post methods for the accept/deny logic
app.post('/intsubmission', async(req, res) => {
    console.log(req.body);

    await sql.connect(sqlConfig)
    const request = new sql.Request()

    //request.input('date', date.now())
    request.input('stu_num', req.body['stu_num'])
    if (req.body['intAccept'] === 'true') {
        console.log('Update Database with Accept')
        request.input('input_param', sql.Bit, req.body['intAccept'])
        request.query('update refunds set int_accept = @input_param where student_number = @stu_num ');

        console.log('Update Database with Accept')
        sendEmail()
    } else {
        console.log('Update Database with Deny')
        request.input('input_param', sql.Bit, req.body['intAccept'])
        request.query('update refunds set int_accept = @input_param where student_number = @stu_num ');

        sendEmail()
    }
    request.query('select * from refunds', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render('management.html', { data: result })
        }
    })


})

app.post('/fisubmission', async(req, res) => {
    await sql.connect(sqlConfig)
    const request = new sql.Request()
    request.input('stu_num', req.body['stu_num'])
    if (req.body['fiAccept'] === 'true') {
        console.log('Update Database with Accept')
        request.input('input_param', sql.Bit, req.body['fiAccept'])
        request.query('update refunds set fi_accept = @input_param where student_number = @stu_num ');

        console.log('Update Database with Accept')
        sendEmail()
    } else {
        console.log('Update Database with Deny')
        request.input('input_param', sql.Bit, req.body['fiAccept'])
        request.query('update refunds set fi_accept = @input_param where student_number = @stu_num ');
        sendEmail()
    }
    request.query('select * from refunds', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render('management.html', { data: result })
        }
    })
})



app.post('/search', (req, res) => { //
    // @TODO: implement search function here once data is acquired.
})

app.listen(port, () => {
    console.log(`Application started @ http://localhost:${port}`)
})

function sendEmail() {

}