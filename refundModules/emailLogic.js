module.exports = {
    testEmail,
}

function testEmail(stage) {
    switch (stage) {
        case "app":
            console.log("App send");
            break;
        case "int":
            console.log("International send");
            break;
        case "fi":
            console.log("Finance send");
            break;
        case "deny":
            console.log("Send Deny");
            break;

        default:
            break;
    }
}