 const display = document.getElementById("display");

/*Why does display work even though it is a constant?
 A) it's value(a property) can be changed
    but it cannot be reassigned 
    therefore- `display +=input` will not work
*/

function Display(input){
    display.value += input;
}

//clear is a reserved keyword in JS so it cannot be named clear()
function clearfunction(){
    display.value = " ";
}

function calculate(){
    try{
        display.value = eval(display.value);
    }

    catch(error){
        display.value = "Error";
    }
}