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
            validateRecaptcha(website.secret, formParams);




        console.log(website);

    });
    let messageObj =request.body;
    response.send(messageObj)
   // let messagesRef = db.ref('/messages/'+websiteid+'/');

    //


    //ref.push(messageObj);

//todo redirect url

});


function validateRecaptcha(secret, message, website){
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
            emailMessage(message, website);
        else
            console.log("Recaptcha validation failed, dropping message")

    });
}


function emailMessage(message, website){
    console.log("WEOOO HOOO ");
}



const endpoint = functions.https.onRequest(app);

module.exports = {
    endpoint
};
