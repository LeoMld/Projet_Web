/*

$(document).ready(function () {
    $('#button_del<%= i %>').click(function () {
        $.ajax({
                url: '/admin/annonces/check',
                type: 'DELETE',
                dataType: 'html',
                data:{id :<%= annonces_check[i].id_annonce %>},
            success: function () {
            $(document.getElementById('test<%= i%>')).toggle('slow');
            console.log("Ca marche !");
        },
        error: function () {
            console.log('marche pas')
        }
    })
    });
    $('#button_val<%= i %>').click(function () {
        $.ajax({
                url: '/admin/annonces/check',
                type: 'PUT',
                dataType: 'html',
                data:{id :<%= annonces_check[i].id_annonce %>},
            success: function () {
            $(document.getElementById('test<%= i%>')).toggle('slow');
        },
        error: function () {
            console.log('marche pas')
        }
    })
    });
});*/
