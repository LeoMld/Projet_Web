$(document).ready(function(){
    $("#search").on("keyup", function() {
        const value = $(this).val().toLowerCase();
        $("#liste div.card").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});