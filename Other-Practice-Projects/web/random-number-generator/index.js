const generate_button = document.getElementById("roll");
const ansLabel = document.getElementById("ans");
const min = 1;
const max = 6;

let randomNum;

generate_button.onclick= function(){
    randomNum=Math.floor(Math.random() *max)+min;
    ansLabel.textContent= randomNum;
}

// for multiple dies, create label2 and label 3, and then copy paste the same function.