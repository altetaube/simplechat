const socket = new WebSocket("ws://localhost:3000");

socket.onopen = function () {
    // Verbindungsaufbau behandeln
    // document.getElementById("a").innerHTML = "Socked Started"

};

socket.onmessage = function(event) {
    console.log(event.data); // Neue Nachricht behandeln
    // document.getElementById("b").innerHTML = event.data;
};
socket.onclose = function(event) {
    // Verbindungsabbau behandeln
    document.getElementById("c").innerHTML = "stopped";
};
//
// socket.send("Hello Server");
//
function sendEvent(eventName, eventData){
    const message = {
        event: eventName,
        data: eventData,
    };
    socket.send(JSON.stringify(message));
}
function getValues(){
    let usr = document.getElementById("usr").value;
    let pwd = document.getElementById("pwd").value;

    // further client side checking
    if (usr === "" || pwd === ""){
        return null;
    }
    return{
        username: usr,
        password: pwd
    };
}


function fire(){
    const result = getValues()
    if (result === null){
        console.log("Not in format")
        return;
    }

    sendEvent('login', {username: 'wert1', password: 'wert2'})
    console.log("like");
}