const functions = require('firebase-functions');
let request = require('request');
let admin = require("firebase-admin");
const cors = require('cors')({origin: true});
const nodemailer = require('nodemailer');




admin.initializeApp(functions.config().firebase);

let db = admin.database();
let ref = db.ref("messages");
let spamRef = db.ref("spam");

let secret = "6LfZSzMUAAAAAKIgsm-6RyuXIlJ6LFckj3JlPDir";
let captchaValidationURL = "https://recaptcha.google.com/recaptcha/api/siteverify"

const DESTINATION = "becheru.razvan@gmail.com";


exports.logMessage = functions.https.onRequest((req, res) => {

    cors(req, res, ()=>{
        let captchaResponse = req.body['g-recaptcha-response'];

        console.log(req.url);

        request.post(captchaValidationURL,
            {form:{"secret":secret,"response":captchaResponse}},
            function(error, response, body){


                logData(req.body, body)
            }
        );

        res.sendStatus(200);
    })
});



function logData(requestBody, captchaResultBody){

    console.log(JSON.parse(captchaResultBody).success);

    if(JSON.parse(captchaResultBody).success===true){
        let messagesRef = ref.push()
        messagesRef.set({
            message:requestBody,
            captcha:JSON.parse(captchaResultBody)
        })
        sendEmail(DESTINATION,  JSON.stringify(requestBody, null, 2) )
    }else{
        let messagesRef = spamRef.push()
        messagesRef.set({
            message:requestBody,
            captcha:JSON.parse(captchaResultBody)
        })
    }


    console.log(captchaResultBody);
}












const gmailUsername = "sostatic.xyz";
const gmailPassword = "jQ6sbEu3";
const mailtransport = nodemailer.createTransport(
    'smtps://'+gmailUsername+':'+gmailPassword+'@smtp.gmail.com');



exports.email = functions.https.onRequest((req, res) => {
    sendEmail(DESTINATION,"Message");
    res.sendStatus(200);
});

function sendEmail(email, message) {
    const mailOptions = {
        from: gmailUsername+"@gmail.com",
        to: email
    };

    // The user subscribed to the newsletter.
    mailOptions.subject = `Mesaj Nou`;
    mailOptions.text = message;
    return mailtransport.sendMail(mailOptions).then(() => {
        console.log('New welcome email sent to:', email);
    });
}