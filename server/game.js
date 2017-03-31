/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util"),					// Utility resources (logging, object inspection, etc)
	io = require("socket.io"),				// Socket.IO
	Player = require("./Player").Player;	// Player class


/**************************************************
** GAME VARIABLES
**************************************************/
var socket,		// Socket controller
	players;	// Array of connected players


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Create an empty array to store players
	players = [];

    socket = require('socket.io')({
      transports  : [ 'websocket' ]
	}).listen(8000)

	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Socket.IO
	socket.sockets.on("connection", onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {
	util.log("New player has connected: "+client.id);

	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);

	// Listen for new player message
	client.on("new player", onNewPlayer);

	// Listen for move player message
	client.on("move player", onMovePlayer);

	client.on("move bullets", onMoveBullets);

    client.on("car hit", onCarHit);
};

// Socket client has disconnected
function onClientDisconnect() {
	util.log("Player has disconnected: "+this.id);

	var removePlayer = playerById(this.id);

	// Player not found
	if (!removePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});
};

// New player has joined
function onNewPlayer(data) {
	util.log('new Player Called');
	if (players.length > 2) {
		return;
	}

	var newPlayer = new Player();
	//first player
	if (players.length==0) {
		console.log('adding player 1');
		newPlayer.x = 30;
		newPlayer.y = 20;
		newPlayer.rotation = 0;
		newPlayer.frame = 0;
		newPlayer.id = this.id;
	} else {
		console.log('adding player 2');
		newPlayer.x = 1170;
		newPlayer.y = 570;
		newPlayer.rotation = 0;
		newPlayer.frame = 1;
		newPlayer.id = this.id;
	}

    util.log("send back new player info - "+newPlayer.frame);
	// Broadcast new player to connected socket clients
	this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.x, y: newPlayer.y, rotation: newPlayer.rotation, frame: newPlayer.frame});


    util.log("send new player info to other players - "+newPlayer.frame);
	this.emit("starting info", {id: newPlayer.id, x: newPlayer.x, y: newPlayer.y, rotation: newPlayer.rotation, frame: newPlayer.frame});


	// Send existing players to the new player
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
        util.log("send existing player info to new player - "+existingPlayer.frame);
		this.emit("new player", {id: existingPlayer.id, x: existingPlayer.x, y: existingPlayer.y, rotation: existingPlayer.rotation, frame: existingPlayer.frame});
	};

	// Add new player to the players array
	players.push(newPlayer);
};

// Player has moved
function onMovePlayer(data) {
	// Find player in array
	var movePlayer = playerById(this.id);

	// Player not found
	if (!movePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Update player position
	movePlayer.x = data.x;
	movePlayer.y = data.y;
	movePlayer.rotation = data.rotation;

	// Broadcast updated position to connected socket clients
	this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.x, y: movePlayer.y, rotation: movePlayer.rotation});
};

//Bullets have moved
function onMoveBullets(data) {
	//just transmit this to the other player
	this.broadcast.emit("move bullets",data);
}

//car hit
function onCarHit(data) {
    //just transmit this to the other player
    this.broadcast.emit("car hit",data);
}


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;

	for (i = 0; i < players.length; i++) {
		if (players[i].id == id)
			return players[i];
	};

	return false;
};


/**************************************************
** RUN THE GAME
**************************************************/
init();