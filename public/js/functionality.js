

const database = firebase.database();

class Website{

    constructor(alias, url, httpsOnly, contact, recaptcha, secret, sitekey){
        this.alias = alias;
        this.url = url;
        this.httpsOnly = httpsOnly;
        this.contact = contact;
        this.recaptcha = recaptcha;
        this.secret = secret;
        this.sitekey = sitekey;
    }
}



function addWebsite(website, callback){
    firebase.database().ref('users/' +user.uid+"/websites").push(website).then(callback);
}