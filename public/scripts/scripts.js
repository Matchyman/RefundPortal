//Functionality for stu-pay display form elements from option
function refTypeDisplay(type) {

    switch (type) {
        case "portal":
            //They only require name and student number(i think)
            //console.log("Portal Requirements")

            document.getElementById("portal-extra").style.display = "none";
            document.getElementById("portal-extra2").style.display = "none";
            document.getElementById("block-international-transfer").style.display = "none";
            document.getElementById("block-home-transfer").style.display = "none";
            break;
        case "bank":
            //console.log("Display credit form elements")
            //Display and make fields required
            document.getElementById("block-home-transfer").style.display = "block";
            document.getElementById("ref-acc-name-ht").required = true;
            document.getElementById("ref-acc-num-ht").required = true;
            //Remove and make fields non-required
            document.getElementById("block-international-transfer").style.display = "none";
            document.getElementById("ref-acc-name-it").required = false;
            document.getElementById("ref-acc-num-it").required = false;
            document.getElementById("ref-swift-code-it").required = false;
            document.getElementById("ref-bank-name-it").required = false;
            document.getElementById("ref-bank-address-it").required = false;

            //document.getElementById("ref-person-paid").required = true;
            document.getElementById("portal-extra").style.display = "block";
            document.getElementById("portal-extra2").style.display = "block";
            break;
        case "international":
            //console.log("Show bank transfer for elements")
            //Display and make fields required
            document.getElementById("block-international-transfer").style.display = "block";
            document.getElementById("ref-acc-name-it").required = true;
            document.getElementById("ref-acc-num-it").required = true;
            document.getElementById("ref-swift-code-it").required = true;
            document.getElementById("ref-bank-name-it").required = true;
            document.getElementById("ref-bank-address-it").required = true;

            //Remove and make fields non-required
            document.getElementById("block-home-transfer").style.display = "none";
            document.getElementById("ref-acc-name-ht").required = false;
            document.getElementById("ref-acc-num-ht").required = false;

            document.getElementById("portal-extra").style.display = "block";
            document.getElementById("portal-extra2").style.display = "block";
            break;
        case "":
            //console.log("reset");
            document.getElementById("ref-acc-name-it").required = false;
            document.getElementById("ref-acc-num-it").required = false;
            document.getElementById("ref-swift-code-it").required = false;
            document.getElementById("ref-bank-name-it").required = false;
            document.getElementById("ref-bank-address-it").required = false;
            document.getElementById("block-international-transfer").style.display = "none";

            document.getElementById("ref-acc-name-ht").required = false;
            document.getElementById("ref-acc-num-ht").required = false;
            document.getElementById("block-home-transfer").style.display = "none";

            document.getElementById("portal-extra").style.display = "block";
            document.getElementById("portal-extra2").style.display = "block";

            break;
        default:
            break;
    }
}

//Functionality for ref-person-paid form elements display
function refPayerDisplay(type) {
    //console.log(type);
    switch (type) {
        case "False":
            document.getElementById("dif-ref-payer").style.display = "block";
            document.getElementById("ref-payer-title").required = true;
            document.getElementById("ref-payer-first-name").required = true;
            document.getElementById("ref-payer-last-name").required = true;
            document.getElementById("ref-payer-address").required = true;
            break;
        case "True":
            document.getElementById("dif-ref-payer").style.display = "none";
            document.getElementById("ref-payer-title").required = false;
            document.getElementById("ref-payer-first-name").required = false;
            document.getElementById("ref-payer-last-name").required = false;
            document.getElementById("ref-payer-address").required = false;
            break;

        default:
            break;
    }
}

function denyReason() {
    prompt("Please enter deny reason", "Enter here");
    document.getElementById("denyReason").innerHTML = reason;

    //prompt("Please Enter Your Name", "bob");
}