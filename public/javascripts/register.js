//animation for register
$(document).ready(function() { //IIFE :Immediately-Invoked Function Expression

    var type = document.getElementById('type');	//form type selector
    var inf = document.getElementById('inf');	//student form elements
    var ent = document.getElementById('ent')	;	//admin form elements

    type.addEventListener('change',function(){
        console.log(type.options[type.selectedIndex].value);

        if(type.options[type.selectedIndex].value === '0'){
            document.getElementById('envoiE').disabled = true;
            document.getElementById('envoiI').disabled = true;
            if (ent.style.display !=="none") {
                $(ent).toggle("slow");
            }
            if (inf.style.display !=="none") {
                $(inf).toggle("slow");
            }
        }
        else if (type.options[type.selectedIndex].value === '1') {
            document.getElementById('envoiI').disabled = false;
            if(inf.style.display ==="none"){
                //check if the element is visible
                if (ent.style.display !=="none") {
                    $(ent).toggle("slow");
                }
                //display the element
                $(inf).toggle("slow");
            }
        }
        else if (type.options[type.selectedIndex].value === '2') {
            document.getElementById('envoiE').disabled = false;
            if(ent.style.display ==="none"){
                //check if the element is visible
                if (inf.style.display !=="none") {
                    $(inf).toggle("slow");
                }
                //display the element
                $(ent).toggle("slow");
            }
        }
    })
});