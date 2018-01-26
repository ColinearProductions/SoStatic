





var config = {
    apiKey: "AIzaSyDOpoNcoeSWE8weaKuT8DvMWt2qSTok11k",
    authDomain: "sostatic-1d381.firebaseapp.com",
    databaseURL: "https://sostatic-1d381.firebaseio.com",
    projectId: "sostatic-1d381",
    storageBucket: "sostatic-1d381.appspot.com",
    messagingSenderId: "446439468118"
};

firebase.initializeApp(config);



function register(user, pass) {
    firebase.auth().createUserWithEmailAndPassword(user, pass).catch(function (error) {
        console.log(error.message);
        onRegisterError(error);
    });
}


function login(user, pass) {
    firebase.auth().signInWithEmailAndPassword(user, pass).catch(function (error) {
        console.log(error.message);
        onLoginError(error);
    });
}

function logout(){
    firebase.auth().signOut().then(function() {
        console.log('Signed Out');
    }, function(error) {
        console.error('Sign Out Error', error);
    });
}



firebase.auth().onAuthStateChanged(function (user) {
    console.log(user);
    if (user) {
        if(redirectLogin)
            window.location.href = "home.html";

    }
});




$(".smooth_scroll").on('click', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);

});


