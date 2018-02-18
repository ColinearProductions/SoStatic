const functions = require('firebase-functions');
let request = require('request');
let admin = require("firebase-admin");
const cors = require('cors')({origin: true});
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const requestPromise = require('request-promise');

const express = require("express");
let recaptchaValidationURL = "https://recaptcha.google.com/recaptcha/api/siteverify";

const gmailUsername = "sostatic.xyz";
const gmailPassword = "jQ6sbEu3";
const mailtransport = nodemailer.createTransport(
    'smtps://'+gmailUsername+':'+gmailPassword+'@smtp.gmail.com');


const pathToTemplate = "https://sostatic.xyz/email/inlined.html";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


admin.initializeApp(functions.config().firebase);
let db = admin.database();




app.post("/:websiteid/:formid", (request, response)=>{
    let websiteid = request.params['websiteid'];
    let formid = request.params['formid'];
    let formParams = request.body;

    //read website configuration
    db.ref('/websites/'+websiteid).once('value').then(snapshot=>{

        let website= snapshot.val();
        let currentForm = website.forms[formid];


        if(website.httpsOnly && request.protocol!=='https')
            console.log("Website expected https, dropping request");

        if(website.url !== request.get('host').split(":")[0])
            console.log("Website defined domain does not match source domain of request, dropping request");

        if(currentForm.recaptcha)
            onValidMessage(formParams, website, currentForm);
           // validateRecaptcha(website.secret, formParams,website,  currentForm);




        console.log(website);

    });
    let messageObj =request.body;
    response.send(messageObj)
   // let messagesRef = db.ref('/messages/'+websiteid+'/');

    //


    //ref.push(messageObj);

//todo redirect url

});


function validateRecaptcha(secret, message, website, form){
    requestPromise({
        uri:recaptchaValidationURL,
        method:'POST',
        formData:{
            secret: secret,
            response: message['g-recaptcha-response']
        },
        json: true
    }).then(result=>{
        if(result.success)
            emailMessage(message, website, form);
        else
            console.log("Recaptcha validation failed, dropping message")

    });
}


function onValidMessage(message, website, form){

    //todo save message to db
    //todo email message

    emailMessage(message, website);
}

function getTemplate(message, website){
    request(pathToTemplate, (error, response, body) =>{
        let template = body;

        let rendered;


        emailMessage(rendered, website)
    });
}


function emailMessage(message, website){




    let email = objToArray(website.contacts)[0].email;
    const mailOptions = {
        from: "So Static",
        to: email
    };

    // The user subscribed to the newsletter.
    mailOptions.subject = 'New submission  - ' + website.alias;
    mailOptions.text = JSON.stringify(message);

    console.log(mailOptions);
    return mailtransport.sendMail(mailOptions).then(() => {
        console.log('New welcome email sent to:', email);
    }).catch((resolve, reject)=>{
        console.log(resolve);
        console.log(reject);

    });


}



const endpoint = functions.https.onRequest(app);

module.exports = {
    endpoint
};


function objToArray(obj){
    return Object.keys(obj).map(function (key) {
        obj[key]['key'] = key;
        return obj[key];
    });
}