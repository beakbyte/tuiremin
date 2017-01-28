var SerialPort      = require('serialport');
var WebSocketServer = require('ws').Server;

var socket = new SerialPort('/dev/ttyUSB0', {
    baudRate: 19200
});

var wss = new WebSocketServer({port: 1337});
var connections = [];


socket.on('open', function() {
    console.log('port open');
});

socket.on('close', function() {
    console.log('port closed');
});

socket.on('error', function(err) {
    console.log('error: ', err.message);
});

socket.on('data', function(data) {
    broadcast(data.toString());
});


wss.on('connection', function(client) {
  	console.log("client connected");
  	connections.push(client);
  	 
  	 //client.on('message', sendToSerial);
  	 
  	client.on('close', function() {
  		  console.log("connection closed");

    		var position = connections.indexOf(client);
    		connections.splice(position, 1);
  	});
});

function broadcast(data) {
    if (connections.length > 0) {
        for (myConnection in connections) {
            connections[myConnection].send(data);
        }
    }
}