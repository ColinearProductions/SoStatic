let config = {
    apiKey: "AIzaSyDOpoNcoeSWE8weaKuT8DvMWt2qSTok11k",
    authDomain: "sostatic-1d381.firebaseapp.com",
    databaseURL: "https://sostatic-1d381.firebaseio.com",
    projectId: "sostatic-1d381",
    storageBucket: "sostatic-1d381.appspot.com",
    messagingSenderId: "446439468118"
};

firebase.initializeApp(config);

////////////////////////////////////   AUTH   //////////////////////////////////////////////////////

function register(user, pass, callback) {
    firebase.auth().createUserWithEmailAndPassword(user, pass).catch(function (error) {
        console.log(error);
        callback(error);
    });
}


function login(user, pass, callback) {
    firebase.auth().signInWithEmailAndPassword(user, pass).catch(function (error) {
        console.log(error);
        callback(error)
    });
}

function logout() {
    firebase.auth().signOut().then(function () {
        console.log('Signed Out');
    }, function (error) {
        console.error('Sign Out Error', error);
    });
}


function forgotPassword(email, callback) {
    firebase.auth().sendPasswordResetEmail(email).then(function () {
        callback();
    }).catch(function (error) {
        callback(error);
    });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////


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
    firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/websites').push(website).then(callback);
}

function addFormToWebsite(website_id, form_info, callback){
    form_info.added_on = firebase.database.ServerValue.TIMESTAMP;
    form_info.message_count = 128;

    firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/websites/'+website_id+"/forms").push(form_info).then(callback);
}


function getWebsiteById(website_id, callback){
    firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/websites/' + website_id).once('value').then(function(snapshot) {
        callback(snapshot.val());
    });
}


function getWebsitesOfUser(callback){
    firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/websites').orderByChild('owner').equalTo(firebase.auth().currentUser.uid).once('value').then(function(snapshot){
        callback(snapshotToArray(snapshot));
    })
}


function updateContacts(website_id, contacts, callback){
    firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/websites/'+website_id+'/contacts').set(contacts).then(function(){
       callback();
    });
}


function updateWebsite(website_id, updateObj, callback){
    firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/websites/'+website_id).update(updateObj).then(function(){
        callback();
    });
}


function updateForm(websiteId, forminfo, formKey, callback){
    console.log(forminfo);
    firebase.database().ref('/users/'+firebase.auth().currentUser.uid+'/websites/'+websiteId+"/forms/"+formKey).update(forminfo).then(function(){
        callback();
    });
}


function getMessages(start_date, end_date,websiteId, formId,showAmount,  callback){


    let query =  firebase.firestore().collection('messages')
        .where('userId','==',firebase.auth().currentUser.uid)
        .where("addedOn","<=",end_date)
        .where("addedOn",">=",start_date);

    if(websiteId!=="0")
        query =  query.where("websiteId","==",websiteId);
    if(formId!=="0")
        query = query.where("formId","==",formId);

    query = query.orderBy("addedOn","desc");


    if(showAmount>0){
       query =  query.limit(showAmount);
    }



    query.get().then((snapshot)=>{

        let res =  snapshot.docs.map((doc)=> {
            let d = doc.data();
            d.key = doc.id;
           return doc.data();
        });

        callback(res);
    });




}

//todo url should actually be called HOST or even better, DOMAIN
//todo when a user is registered, add an entry to the db, all the websites and forms created by that user will be under the user node
