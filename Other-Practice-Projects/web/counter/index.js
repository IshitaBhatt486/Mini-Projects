const decreaseVal = document.getElementById("decrease");
const increaseVal = document.getElementById("increase");
const resetVal = document.getElementById("reset");
const count= document.getElementById("countLabel");

let counter=0;

increaseVal.onclick= function(){
    counter++;
    count.textContent=counter;
}

decreaseVal.onclick= function(){
    counter--;
    count.textContent=counter;
}

resetVal.onclick= function(){
    counter=0;
    count.textContent=counter;
}
