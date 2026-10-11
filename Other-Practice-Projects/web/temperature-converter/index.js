const inputVal = document.getElementById("inputVal");
const fahrenheit = document.getElementById("fahrenheit");
const celsius = document.getElementById("celsius");
const output = document.getElementById("output");

let result;

function convert(){

    if(fahrenheit.checked){

        result = Number(inputVal.value);
        result = (result * 9 / 5) + 32;
        output.textContent = result.toFixed(2) + "°F";//to Fixed(1)- gives till 1 decimal point

    }

    else if(celsius.checked){

        result = Number(inputVal.value);//input is treaated as string so we must take it's value
        result = (result - 32) * (5/9);
        output.textContent = result.toFixed(2) + "°C";

    }

    else{
        output.textContent = "Please select a unit"; 
    }

}