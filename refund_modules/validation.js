const { body, validationResult, sanitizeBody, check, oneOf } = require('express-validator');

module.exports = function(req) {
    console.log(req.body[0]);
    /*
    switch (req.body[0]) {
        case 'portal':

            body('ref-first-name').trim().escape().isLength({ min: 1 }).withMessage('Empty first name').isAlpha().withMessage('First name must contain alphabet letters'),
                body('ref-last-name').trim().escape().isLength({ min: 1 }).withMessage('Empty last name').isAlpha().withMessage('Last name must contain alphabet letters'),
                body('student-number').trim().escape().isLength({ min: 7, max: 7 }).withMessage('Student number must be 7 digits').isNumeric().withMessage('Content must not contain alphabetic letters'),



                return errors;
            break;
        case 'bank':
            break;

        case 'international':
            break;
        default:
            break;
    }

    */



    console.log(req.body);
}