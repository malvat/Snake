// some variables to keep track of playboard and snake
var coordinates = [];   // coordinates of snake 
var rows = 20;          // width
var cols = 30;          // height
var direction = 0; // 0 right 1 down 2 left 3 up
var snakeHead = null;   
var food = null;
// if game is finished or not
var isGameFinished = false;
var speed = 6;
var score = 0;

class snakeElement {
    x = 0;
    y = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

var snake = [];

var canvas = null;

/**
 * initlialzing the coordinates 
 */
function initializePlayboard() {
    for(var i = 0; i < rows; i++) {
        coordinates.push([0]);
        for(var j = 0; j < cols; j++) {
            coordinates[i][j] = false;
        }
    }    
}

/**
 * adding snake and food to the playboard
 */
function updatePlayboard() {
    initializePlayboard();
    for(var i =0; i< snake.length; i++) {
        coordinates[snake[i].x][snake[i].y] = true;
    }
    coordinates[food.x][food.y] = true;
}

/**
 * printing playboard according to what item is to be printed
 */
function printPlayboard() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    for(var i = 0; i < rows; i++) {
        for(var j = 0; j < cols; j++) {
            if(coordinates[i][j]) {
                if(i == food.x && j == food.y) {
                    ctx.fillStyle = "#ff0000";
                } else {
                    ctx.fillStyle = "#000000";
                }
                ctx.fillRect(i*20,j*20,20,20);
            }
        }
    }
}

/**
 * making body to follow the head
 */
function followSnake() {
    for(var i = snake.length - 1; i > 0; i--) {
        snake[i].x = snake[i-1].x;
        snake[i].y = snake[i-1].y;
    }
}

/**
 * starting game when website has loaded
 */
window.onload = function() {
    initializePlayboard();
    snakeHead = new snakeElement(5, 10);
    snake.push(snakeHead);
    s = new snakeElement(4,10);
    snake.push(s);
    s = new snakeElement(3,10);
    snake.push(s);
    canvas = document.getElementById('playboard');
    canvas.focus();
    ctx = canvas.getContext("2d");

    game = setInterval(loop, 1000/speed);
    canvas.addEventListener("keydown", function(e) {
        if(e.keyCode == 68 && direction != 2) {
            direction = 0;

        } else if(e.keyCode == 65 && direction != 0 ) {
            direction = 2;
           
        } else if(e.keyCode == 87 && direction != 1) {
            direction = 3;
            
        } else if(e.keyCode == 83 && direction != 3) {
            direction = 1;
        }

        if(isGameFinished) {
            if(e.keyCode == 82) {
                document.location.reload();
            }
        }
        
    });

    puttingFood();
}

/**
 * updating snake head using direction
 */
function updateSnakeHead() {
    if(direction == 0) {
        // right
        snakeHead.x++;
    } else if(direction == 1) {
        // down
        snakeHead.y++;
    } else if(direction == 2) {
        // left
        snakeHead.x--;
    } else if(direction == 3) {
        // up 
        snakeHead.y--;
    }
}

/**
 * put food randomly on the board 
 */
function puttingFood() {
    x = Math.floor(Math.random() * (rows-1));
    y = Math.floor(Math.random() * (cols-1));
    // make sure it does not collide with snake
    for(var i = 0; i < snake.length; i++) {
        if(x == snake[i].x && y == snake[i].y) {
            puttingFood();
        }
    }
    // we have food
    food = new snakeElement(x, y);
}

/**
 * check if snake has eaten the food or not
 */
function foodEaten() {
    if(snake[0].x == food.x && snake[0].y == food.y) {
        snake.push(food);
        puttingFood();
        score+=10;
    }
}

/**
 * check if snake has collided and died or not
 */
function gameover() {
    //collision with self
    for(var i = 1; i < snake.length; i++){
        if(snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            clearInterval(game);
            document.getElementById('gameover').style.opacity = 1;
            isGameFinished = true;
        }
    }
    //collision with walls
    if(snake[0].x < 0 || snake[0].x > rows-1 || snake[0].y < 0|| snake[0].y > cols-1) {
        clearInterval(game);
        isGameFinished = true;
        document.getElementById('gameover').style.opacity = 1;
    }
}

/**
 * the main game loop 
 */
function loop() {
    canvas.focus(); 
    updateScoreBoard();
    updatePlayboard();
    printPlayboard();
    followSnake();
    updateSnakeHead();
    gameover();
    foodEaten();
}

/**
 * resetting the game after it is over
 */
function onClickReset() {
    document.location.reload();
}

/**
 * update the score according to the gameplay
 */
function updateScoreBoard() {
    var scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = "Score &rarr; " + score +  "</br>" + "Length &rarr; " + snake.length;
}