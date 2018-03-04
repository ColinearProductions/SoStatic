


$(document).ready(function () {
    // the "href" attribute of the modal trigger must specify the modal ID that wants to be triggered
    $('.modal').modal();
    $('select').material_select();
    $('ul.tabs').tabs();

    try {
        $(".mh1").matchHeight({
            property: 'min-height'
        })

    } catch (err) {
    }

    $(".button-collapse").sideNav();
//todo select with predefined values yesterday, 1 week, 1 month etc.

    Materialize.updateTextFields();


    let validationItems = $(".mvalidate");
    $(validationItems).on("focusout", function () {
        onValidateInput(this);
    });



    $(".smooth_scroll").on('click', function (event) {

        if (this.hash !== "") {
            event.preventDefault();
            let hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 500, function(){
                window.location.hash = hash;
            });
        }

    });

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


function onValidateInput(element) {


    if (element === undefined)
        element = this;

    let val = $(element).val();

    if( $(element).data("validate-if-checked") !== undefined){
        let target = $($(element).data("validate-if-checked"));

        $(target).change(()=>{
           onValidateInput(element);
        });

        if(!$(target).prop("checked")) {
            hideError(element);
            return;
        }
    }


    if ($(element).data("validate-email") !== undefined) {

        if($(element).data("validate-optional") !== undefined && val.length <1) {
            hideError(element);
            return;
        }

        let err_msg = "This field must contain a valid email";
        if (validateEmail(val))
            hideError(element);
        else {
            showError(element, err_msg);
            return;
        }
    }

    if ($(element).data("min-length") !== undefined) {
        if (val.length < $(element).data("min-length")) {
            showError(element, "Text too short, must have at least " + $(element).data("min-length") + " character(s)");
            return;
        } else
            hideError(element)
    }

    if ($(element).data("max-length") !== undefined) {
        if (val.length > $(element).data("max-length")) {
            showError(element, "Text too long, use at most " + $(element).data("max-length") + " characters");
            return;
        } else
            hideError(element)

    }

    if ($(element).data("validate-required") !== undefined) {
        if (val.length < 1) {
            showError(element, "This field is required");
            return;
        } else
            hideError(element);
    }


}

function isFormCompleted(form) {
    let ret = true;
    $(form).find(".mvalidate").each((i, obj) => {
        onValidateInput(obj);
    });

    if ($(form).find("input.invalid").length > 0) {
        ret = false;
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





function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
}