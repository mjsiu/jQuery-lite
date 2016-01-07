var Board = require('./snake.js');

function View($el){
  this.$el = $el;
  this.board = new Board();
  setInterval(this.step.bind(this), 500);
}

var DIRECTIONS = {
  38: "N",
  40: "S",
  37: "W",
  39: "E"
};

View.prototype.eventListener = function () {
  this.$el.on("keydown", function(e) {
    var code = e.keyCode;
    var newDirection = DIRECTIONS[code];
    // left = 37, up = 38, right = 39, down = 40;
    this.board.snake.turn(newDirection);
  });
};

View.prototype.step = function () {
  this.board.snake.move();
};

module.exports = View;
