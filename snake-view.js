(function () {
  if (window.SnakeGame === undefined) {
    window.SnakeGame = {}
  }

  var View = window.SnakeGame.View = function($el){
    this.$el = $el;
    this.$grid = this.$el.find(".grid");

    this.initialize(false);
  };

  View.prototype.initialize = function (restart) {
    this.board = new window.SnakeGame.Board();
    this.snake = this.board.snake;
    this.boardSize = this.board.BOARD_SIZE;

    this.lastSegment = null;
    this.apple = null;
    this.speedInMs = 100;
    this.points = 0;

    $(".game-over").addClass("standby");
    $(".retry-button").addClass("standby");

    if (!restart) {
      this.bindListener();
      this.bindRestart();
    } else {
      this.$grid.empty();
    }

    this.buildCanvasBoard();
    this.canvasRender();
    this.startGame();
  };

  View.prototype.restartGame = function () {
    if ($(".game-over").hasClass("active")) {
      $(".game-over").addClass("leave")
      $(".retry-button").addClass("leave")

      $(".game-over").on("transitionend", function () {
        $(".game-over").removeClass("active");
        $(".retry-button").removeClass("active");

        $(".game-over").removeClass("leave");
        $(".retry-button").removeClass("leave");

        $(".game-over").removeClass("game-over-in-place");
        $(".retry-button").removeClass("retry-button-in-place");

        $(".game-over").unbind("transitionend")

        this.initialize(true);
      }.bind(this));
    }
  };

  View.prototype.buildCanvasBoard = function () {
    for (var i = 0; i < this.boardSize * this.boardSize; i++){
      this.$grid.append("<section class='cell'></section>");
    }
  };

  View.prototype.canvasRender = function () {
    $(".points").text("Points: " + this.points);

    var snakeSegs = this.snake.segments;

    if (this.lastSegment != null) {
      this.$grid.find(".cell").eq(this.lastSegment).removeClass("snake");
    }

    for (var i = 0; i < snakeSegs.length; i++) {
      var pos = snakeSegs[i].pos;
      var child = (pos[0] * (this.boardSize)) + pos[1];

      this.$grid.find(".cell").eq(child).addClass("snake");

      if (i === snakeSegs.length - 1) {
        this.lastSegment = child;
      }
    }
  };

  View.prototype.startGame = function () {
    this.plantApple();
    this.step();
  };

  View.prototype.plantApple = function () {
    var planted = false, taken = false;
    var snakeSegments = this.snake.segments;

    while (planted === false) {
      planted = true;
      var row = Math.floor(Math.random() * this.board.BOARD_SIZE);
      var col = Math.floor(Math.random() * this.board.BOARD_SIZE);

      if (this.apple && row === this.apple[0] && col === this.apple[1]) {
        planted = false
      }

      for (var i = 0; i < snakeSegments.length; i++) {
        if (snakeSegments[i].pos[0] === row &&
            snakeSegments[i].pos[1] === col) {
          planted = false;
        }
      }
    }

    this.apple = [row, col];
    var child = (row * (this.boardSize)) + col;
    this.$grid.find(".cell").eq(child).addClass("apple");
  };

  View.prototype.checkApple = function (coord) {
    if (coord[0] === this.apple[0] && coord[1] === this.apple[1]) {
      return true;
    }

    return false;
  };

  View.prototype.step = function () {
    window.setTimeout(function () {
      var apple = false;
      if (this.board.checkValidMove()) {

        if (this.checkApple(this.snake.nextMove())) {
          this.points += 100;
          apple = true;
          this.removeAndAddApple();
        }

        this.snake.move(apple);
        this.canvasRender();

        this.step();
      } else {
        $(".game-over").addClass("active");
        $(".retry-button").addClass("active");

        window.setTimeout(function () {
          $(".game-over").addClass("game-over-in-place")
          $(".retry-button").addClass("retry-button-in-place")
        }, 0)
      };
    }.bind(this), this.speedInMs);
  };

  View.prototype.bindRestart = function () {
    var that = this;

    $(document).on("keyup", function (event) {
      if (event.keyCode === 13) {
        that.restartGame();
      };
    });

    $(".retry-button").on("click", function (event) {
      that.restartGame();
    });
  };

  View.prototype.removeAndAddApple = function () {
    var child = (this.apple[0] * (this.boardSize)) + this.apple[1];
    this.$grid.find(".cell").eq(child).removeClass("apple");
    this.plantApple();
  };

  View.prototype.bindListener = function () {
    this.$el.on("keydown", function(event){
      this.handleKeyEvent(event);
    }.bind(this))
  };

  View.prototype.handleKeyEvent = function (event) {
    switch (event.keyCode) {
      case 38:
        this.snake.turn("N")
        break;
      case 39:
        this.snake.turn("E")
        break;
      case 40:
        this.snake.turn("S")
        break;
      case 37:
        this.snake.turn("W")
        break;
    }
  };

})();
