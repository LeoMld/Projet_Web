$(document).ready(function(){
    $("#search").on("keyup", function() {
        const value = $(this).val().toLowerCase();
        $("#liste tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});