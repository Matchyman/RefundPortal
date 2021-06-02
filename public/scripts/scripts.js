//Functionality for stu-pay display form elements from option
function refTypeDisplay(type) {

    switch (type) {

        case "credit":
            //console.log("Display credit form elements")
            //Display and make fields required
            document.getElementById("block-card-transfer").style.display = "block";
            document.getElementById("ref-acc-name-ct").required = true;
            document.getElementById("ref-acc-num-ct").required = true;
            document.getElementById("ref-sort-code-ct").required = true;
            //Remove and make fields non-required
            document.getElementById("block-bank-transfer").style.display = "none";;
            document.getElementById("ref-acc-name-bt").required = false;
            document.getElementById("ref-acc-num-bt").required = false;
            document.getElementById("ref-swift-code-bt").required = false;
            document.getElementById("ref-bank-name-bt").required = false;
            document.getElementById("ref-bank-address-bt").required = false;
            break;
        case "transfer":
            //console.log("Show bank transfer for elements")
            //Display and make fields required
            document.getElementById("block-bank-transfer").style.display = "block";
            document.getElementById("ref-acc-name-bt").required = true;
            document.getElementById("ref-acc-num-bt").required = true;
            document.getElementById("ref-swift-code-bt").required = true;
            document.getElementById("ref-bank-name-bt").required = true;
            document.getElementById("ref-bank-address-bt").required = true;

            //Remove and make fields non-required
            document.getElementById("block-card-transfer").style.display = "none";
            document.getElementById("ref-acc-name-ct").required = false;
            document.getElementById("ref-acc-num-ct").required = false;
            document.getElementById("ref-sort-code-ct").required = false;
            break;
        case "":
            //console.log("reset");
            document.getElementById("block-bank-transfer").style.display = "none";
            document.getElementById("block-card-transfer").style.display = "none";

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