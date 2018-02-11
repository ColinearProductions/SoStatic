

const database = firebase.database();

class Website{

    constructor(alias, url, httpsOnly, contacts, recaptcha, secret, sitekey){
        this.alias = alias;
        this.url = url;
        this.httpsOnly = httpsOnly;
        this.contacts = contacts;
        this.recaptcha = recaptcha;
        this.secret = secret;
        this.sitekey = sitekey;
        this.forms = [];
        this.messages = [];
        this.owner = firebase.auth().currentUser.uid;
    }
}



function addWebsite(website, callback){
    firebase.database().ref('/websites').push(website).then(callback);
}


function getWebsiteById(website_id, callback){
    firebase.database().ref('/websites/' + website_id).once('value').then(function(snapshot) {
        callback(snapshot.val());
    });
}


function getWebsitesOfUser(callback){
    firebase.database().ref('/websites').orderByChild('owner').equalTo(firebase.auth().currentUser.uid).once('value').then(function(snapshot){
        callback(snapshotToArray(snapshot));
    })
}


function updateContacts(website_id, contacts, callback){
    firebase.database().ref('/websites/'+website_id+'/contacts').set(contacts).then(function(){
       callback();
    });
}


function updateWebsite(website_id, updateObj, callback){
    firebase.database().ref('/websites/'+website_id).update(updateObj).then(function(){
        callback();
    });
}


