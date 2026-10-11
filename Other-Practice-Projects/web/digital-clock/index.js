function updateClock(){

    //get the initial time
    const now = new Date();
    let hours = now.getHours();
    //is it am or pm
    const meridiem = hours >= 12 ? "PM" : "AM";
    //convert time to am/pm
    hours = hours % 12 || 12;
    //why '|| 12' ? Ans) otherwise at 12 o clock, it will give hours as zero
    //add zeros to the time so that it remains a constant length and looks pretty
    hours = hours.toString().padStart(2, 0);
    //similarly assign
    const minutes = now.getMinutes().toString().padStart(2, 0);
    const seconds = now.getSeconds().toString().padStart(2, 0);
    //the final string is a combo of all strings
    //dollar signs help us make the final string in a concise way
    const timeString = `${hours}:${minutes}:${seconds} ${meridiem}`;
    //display the string
    document.getElementById("time").textContent = timeString;

}

updateClock();

setInterval(updateClock, 1000);//keep calling the update clock every 1000ms
//refresh rate=1000ms