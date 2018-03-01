const functions = require('firebase-functions');
let request = require('request');
let admin = require("firebase-admin");
const cors = require('cors')({origin: true});
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const requestPromise = require('request-promise');
const Mustache = require('mustache');

const express = require("express");
let recaptchaValidationURL = "https://recaptcha.google.com/recaptcha/api/siteverify";

const gmailUsername = "sostatic.xyz";
const gmailPassword = "jQ6sbEu3";
const mailtransport = nodemailer.createTransport(
    'smtps://' + gmailUsername + ':' + gmailPassword + '@smtp.gmail.com');


const pathToTemplate = "https://sostatic.xyz/email/inlined.html";

const app = express();
app.use(bodyParser.urlencoded({extended: true}));


admin.initializeApp(functions.config().firebase);
let db = admin.database();


app.post("/:websiteid/:formid", (request, response) => {
    let websiteid = request.params['websiteid'];
    let formid = request.params['formid'];
    let formParams = request.body;

    //read website configuration
    db.ref('/websites/' + websiteid).once('value').then(snapshot => {

        let website = snapshot.val();
        website.id = websiteid;

        let currentForm = website.forms[formid];
        currentForm.id = formid;


        if (website.httpsOnly && request.protocol !== 'https')
            console.log("Website expected https, dropping request");

        if (website.url !== request.get('host').split(":")[0])
            console.log("Website defined domain does not match source domain of request, dropping request");

        if (currentForm.recaptcha)
            validateRecaptcha(website.secret, formParams, website, currentForm, websiteid, formid);
        else{
            onValidMessage(formParams, website, currentForm)
        }


    }).catch((ex)=>{
        console.log("Exception on message received");
        console.log(ex);
        console.log(ex.message);
    });
    let messageObj = request.body;
    response.send(messageObj)


//todo redirect url

});


function validateRecaptcha(secret, message, website, form, websiteid, formid) {
    console.log("Validating recaptcha");
    requestPromise({
        uri: recaptchaValidationURL,
        method: 'POST',
        formData: {
            secret: secret,
            response: message['g-recaptcha-response']
        },
        json: true
    }).then(result => {
        if (result.success) {
            console.log("Recaptcha matched successfully");
            emailMessage(message, website, form);
            onValidMessage(website, form, websiteid, form)
        } else
            console.log("Recaptcha validation failed, dropping message")

    });
}


function onValidMessage(message, website, form) {

    delete message['g-recaptcha-response'];
    writeToDb(message, website, form);
    loadTemplate(message, website, form);
}

function loadTemplate(message, website, form) {
    request(pathToTemplate, (error, response, body) => {
        let template = body;


        let entries = [];

        for (let key in message)
            if (message.hasOwnProperty(key))
                entries.push({key: key, value: message[key]});


        console.log(message);

        let emailData = {
            'alias': website.alias,
            'formAlias': form.alias,
            'entries': entries,
            'websiteurl': website.url,
            'unsubscribeUrl': ""

        };

        console.log(emailData);
        let rendered = Mustache.render(template, emailData);


        emailMessage(rendered, website)
    });
}

function writeToDb(message, website, form) {
    message.formId = form.id;
    message.addedOn = admin.database.ServerValue.TIMESTAMP;
    db.ref('/messages/' +website.id).push(message);
}

function emailMessage(message, website) {
    delete message['formId'];
    delete message['addedOn'];


    let email = objToArray(website.contacts)[0].email;
    const mailOptions = {
        from: "So Static",
        to: email
    };

    // The user subscribed to the newsletter.
    mailOptions.subject = 'New submission  - ' + website.alias;
    mailOptions.html = message;

    console.log("Mail options");
    console.log(mailOptions);
    return mailtransport.sendMail(mailOptions).then(() => {
        console.log('New welcome email sent to:', email);
    }).catch((resolve, reject) => {
        console.log(resolve);
        console.log(reject);

    });


}



function objToArray(obj) {
    return Object.keys(obj).map(function (key) {
        obj[key]['key'] = key;
        return obj[key];
    });
}



const endpoint = functions.https.onRequest(app);

module.exports = {
    endpoint
};
