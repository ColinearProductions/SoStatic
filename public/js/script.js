





var config = {
    apiKey: "AIzaSyDOpoNcoeSWE8weaKuT8DvMWt2qSTok11k",
    authDomain: "sostatic-1d381.firebaseapp.com",
    databaseURL: "https://sostatic-1d381.firebaseio.com",
    projectId: "sostatic-1d381",
    storageBucket: "sostatic-1d381.appspot.com",
    messagingSenderId: "446439468118"
};

firebase.initializeApp(config);



function register(user, pass, callback) {
    firebase.auth().createUserWithEmailAndPassword(user, pass).catch(function (error) {
        console.log(error.message);
        callback(error);
    });
}


function login(user, pass, callback) {
    firebase.auth().signInWithEmailAndPassword(user, pass).catch(function (error) {
        console.log(error.message);
        callback(error)
    });
}

function logout(){
    firebase.auth().signOut().then(function() {
        console.log('Signed Out');
    }, function(error) {
        console.error('Sign Out Error', error);
    });
}


function forgotPassword(email, callback){
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        callback();
    }).catch(function(error) {
        callback(error);
    });
}



firebase.auth().onAuthStateChanged(function (user) {
    console.log(user);
    if (user) {
        if(redirectLogin)
            window.location.href = "dashboard.html";

    }
});




$(".smooth_scroll").on('click', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);

});




$(document).ready(function () {
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    $('select').material_select();

    $(".mh1").matchHeight({
        property: 'min-height'
    });

    $(".button-collapse").sideNav();

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false // Close upon selecting a date,
    });

});


function matchHeightUpdate() {
    $.fn.matchHeight._update()
}
