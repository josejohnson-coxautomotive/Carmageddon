/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function() {
	var x = 0,
		y = 0,
		frame = 0,
		rotation = 0,
		id;


	// Define which variables and methods can be accessed
	return {
		x: x,
		y: y,
		rotation: rotation,
		id: id,
		frame: frame
	}
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;