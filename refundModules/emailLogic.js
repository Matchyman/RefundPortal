const nodemailer = require('nodemailer');
const Email = require('email-templates');

//Look into email-templates npm module
module.exports = {
    sendEmail,
}

const email = new Email({
    message: {
        from: 'projectdigitiserefundportal@gmail.com'
    },
    transport: {
        jsonTransport: true
    }

});


let mailOptions = {
    from: '',
    to: '',
    subject: 'Test',
    text: " Just Checking to see if this works!"
};

let appAccepted = {
    from: '',
    to: '',
    subject: 'Test',
    text: "Your application has been accepted"
};

let intAccepted = {
    from: '',
    to: '',
    subject: 'Test',
    text: "Application has been accepted by the international team"
};

let fiAccepted = {
    from: '',
    to: '',
    subject: 'Test',
    text: "Application has been accepted by the finance team"
};

let denied = {
    from: '',
    to: '',
    subject: 'Test',
    text: "Application has been accepted by the finance team"
};


function sendEmail(stage) {

    switch (stage) {
        case "app":
            email.send({
                    template: 'appSuccess',
                    message: {
                        to: 'jmatcham31@googlemail.com'
                    },
                })
                .then(console.log)
                .catch(console.error);

            /*
            transporter.sendMail(appAccepted, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent' + info.response);
                }
            });
            */
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