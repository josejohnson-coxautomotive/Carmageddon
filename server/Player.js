/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY, startRotation) {
	var x = startX,
		y = startY,
		rotation = startRotation,
		id;


	// Define which variables and methods can be accessed
	return {
		x: x,
		y: y,
		rotation: rotation,
		id: id
	}
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;