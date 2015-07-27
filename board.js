(function () {
  if (window.SnakeGame === undefined) {
    window.SnakeGame = {}
  }

  var Board = window.SnakeGame.Board = function(){
    this.snake = new SnakeGame.Snake();
    this.grid = this.generateGrid();
    this.BOARD_SIZE = 25;
  };

  Board.prototype.checkValidMove = function () {
    var isValid = true;
    var nextPos = this.snake.nextMove();

    if (nextPos[0] >= this.BOARD_SIZE || nextPos[0] < 0 ||
        nextPos[1] >= this.BOARD_SIZE || nextPos[1] < 0) {
      isValid = false;
    }

    var segments = this.snake.segments;
    for (var i = 0; i < segments.length; i++) {
      var coord = segments[i]
      if (coord.pos[0] === nextPos[0] && coord.pos[1] === nextPos[1]) {
        isValid = false;
      }
    }

    return isValid;
  }

  Board.prototype.checkApple = function () {
    var headPos = this.snake.head.pos;

    if (this.grid[headPos[0], headPos[1]] === 'A') {
      return true;
    }

    return false;
  }

  Board.prototype.generateGrid = function() {
    var tempGrid = [];

    for (var i = 0; i < this.BOARD_SIZE; i++){
      var temp = [];
      for (var j = 0; j < this.BOARD_SIZE; j++){
        temp.push(".");
      }

      tempGrid.push(temp);
    }

    return tempGrid;
  };

  Board.prototype.render = function () {
    this.grid = this.generateGrid()

    this.snake.segments.forEach(function(segment) {
      var pos = segment.pos;
      this.grid[pos[0]][pos[1]] = 'S';
    }.bind(this))

    for (var i = 0; i < 10; i++){
      console.log(i, JSON.stringify(this.grid[i]));
    }
  };

  Board.prototype.currentGrid = function () {
    var grid = this.generateGrid()

    this.snake.segments.forEach(function(segment){
      var pos = segment.pos;
      this.grid[pos[0]][pos[1]] = 'S';
    }.bind(this))

    return grid;
  };


})();
