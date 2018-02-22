let config = {
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

    try {
        $(".mh1").matchHeight({
            property: 'min-height'
        })

    } catch (err) {
    }

    $(".button-collapse").sideNav();

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false // Close upon selecting a date,
    });


    Materialize.updateTextFields();


    let validationItems = $(".mvalidate");
    $(validationItems).on("focusout", onValidateInput);


});


 function showError(element, message) {
    $(element).siblings('.validation-error').remove();
    $('<p class="validation-error">' + message + '</p>').insertAfter(element);
    $(element).addClass("invalid");
}

function hideError(element) {
    $(element).siblings('.validation-error').remove();
    $(element).removeClass("invalid");
}


function onValidateInput() {

    let val = $(this).val();





    if ($(this).data("validate-email") !== undefined) {
        let err_msg = "This field must contain a valid email";
        if (validateEmail(val))
            hideError(this);
        else {
            showError(this, err_msg);
            return;
        }
    }

    if ($(this).data("min-length") !== undefined) {
        if(val.length<$(this).data("min-length")) {
            showError(this, "Text too short, must have at least " + $(this).data("min-length") + " character(s)");
            return;
        }else
            hideError(this)
    }

    if ($(this).data("max-length") !== undefined) {
        if(val.length>$(this).data("max-length")) {
            showError(this, "Text too long, use at most " + $(this).data("max-length") + " characters");
            return;
        }else
            hideError(this)

    }

    if ($(this).data("validate-required") !== undefined) {
        if (val.length < 1) {
            showError(this, "This field is required");
            return;
        }else
            hideError(this);
    }


}

function isFormCompleted(form){
     let ret  = true;
    $(form).find("[data-validate-required]").each((i,obj)=>{
        if($(obj).val().length<1) {
            showError(obj, "This field is required");
            ret = false
        }
    });

    if($(form).find(".invalid").length>0){
        ret= false;
    }

    return ret;
}


function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


function matchHeightUpdate() {
    $.fn.matchHeight._update()
}


function snapshotToArray(snapshot) {
    let returnArr = [];

    console.log(typeof snapshot);

    snapshot.forEach(function (childSnapshot) {
        let item = childSnapshot.val();
        item.key = childSnapshot.key;


        returnArr.push(item);
    });

    return returnArr;
}

function objToArray(obj) {
    return Object.keys(obj).map(function (key) {
        obj[key]['key'] = key;
        return obj[key];
    });
}


$.extend({
    getUrlVars: function () {
        let vars = [], hash;
        let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (let i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1].replace("#", "");
        }
        return vars;
    },
    getUrlVar: function (name) {
        return $.getUrlVars()[name];
    }
});



