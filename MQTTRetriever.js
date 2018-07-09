host = "";
port = 0;
topic = "";
clientID = "";

// Called when form is submitted
function validateForm() {
    clientID = "myclientid_" + parseInt(Math.random() * 100, 10);
    host = document.getElementById("host").value;
    port = document.getElementById("port").value;
    $('#messages').append('<span>&gt;&gt;&gt; Connecting to: ' + host + 'on port: ' + port + '</span><br/>')
    $('#messages').append('<span>&gt;&gt;&gt; Using the following client ID: ' + clientID + '</span><br/>')
}

// Called after form input is processed
function startConnect() {
    topic = document.getElementById("topic").value;

    // Initialize new Paho client connection
    client = new Paho.MQTT.Client(host, Number(port), clientID);

    // Set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // Connect the client
    client.connect({
        onSuccess: onConnect
    });
}

// called when the client connects
function onConnect() {
    $('#messages').append('<span>&gt;&gt;&gt; Connected to: ' + host + '</span><br/>')
    client.subscribe(topic);
    $('#messages').append('<span>&gt;&gt;&gt; Subscribing to: ' + topic + '</span><br/>')
}

function postTestMessage() {
    message = new Paho.MQTT.Message("Hello");
    message.destinationName = topic;
    client.send(message);
}

// Called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost: " + responseObject.errorMessage);
    }
}

// Called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived: " + message.payloadString);
    $('#messages').append('<span>Topic: ' + message.destinationName + '  | ' + message.payloadString + '</span><br/>');
    updateScroll();
}

// Called when the disconnection button is pressed
function onDisconnectButton() {
    client.disconnect();
    $('#messages').append('<span>&gt;&gt;&gt; Unsubscribed from: ' + topic + '</span><br/>')
    $('#messages').append('<span>&gt;&gt;&gt; Disconnected from: ' + host + '</span><br/>')
    updateScroll();
}

// Updates #messages to auto-scroll
function updateScroll() {
    var element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;
}