
const $hamburger = $(".hamburger");
$hamburger.on("click", function() {
    $hamburger.toggleClass("is-active");
    // Do something else, like open/close menu
});
/*fonction permettant d'avoir un menu dynamique lors qu'on défile une page*/
$(document).ready(function() {

    $(window).scroll(function() {


        if($(document).scrollTop() >= 80 && $(window).width() > 991 ) {
            $('#nav').addClass('shrink');
        }

        else if($(document).scrollTop() <= 1 && $(window).width() > 991 ){
            $('#nav').removeClass('shrink');
        }



    });
});



