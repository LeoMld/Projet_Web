$(document).ready(function() {

    $(window).scroll(function() {


        if($(document).scrollTop() >= 80 && $(window).width() > 991 ) {

            $('#nav').addClass('shrink');
            $('#nav').removeClass('phone');


        }

        else if($(document).scrollTop() <= 1 && $(window).width() > 991 ){
            $('#nav').removeClass('shrink');
        }



    });
});