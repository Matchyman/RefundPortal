const nodemailer = require('nodemailer');

module.exports = {
    sendEmail,
}

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'projectdigitiserefundportal@gmail.com',
        pass: 'projectdigitise'
    }
});

let mailOptions = {
    from: 'projectdigitiserefundportal@gmail.com',
    to: 'jmatcham31@googlemail.com',
    subject: 'Test',
    text: " Just Checking to see if this works!"
};

let appAccepted = {
    from: 'projectdigitiserefundportal@gmail.com',
    to: 'jmatcham31@googlemail.com',
    subject: 'Test',
    text: "Your application has been accepted"
};

let intAccepted = {
    from: 'projectdigitiserefundportal@gmail.com',
    to: 'jmatcham31@googlemail.com',
    subject: 'Test',
    text: "Application has been accepted by the international team"
};

let fiAccepted = {
    from: 'projectdigitiserefundportal@gmail.com',
    to: 'jmatcham31@googlemail.com',
    subject: 'Test',
    text: "Application has been accepted by the finance team"
};

let denied = {
    from: 'projectdigitiserefundportal@gmail.com',
    to: 'jmatcham31@googlemail.com',
    subject: 'Test',
    text: "Application has been accepted by the finance team"
};


function sendEmail(stage) {

    switch (stage) {
        case "app":
            transporter.sendMail(appAccepted, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent' + info.response);
                }
            });
            break;
        case "int":
            transporter.sendMail(intAccepted, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent' + info.response);
                }
            });
            break;
        case "fi":
            transporter.sendMail(fiAccepted, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent' + info.response);
                }
            });
            break;
        case "deny":
            transporter.sendMail(denied, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent' + info.response);
                }
            });
            break;

        default:
            break;
    }


    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent' + info.response);
        }
    });
}