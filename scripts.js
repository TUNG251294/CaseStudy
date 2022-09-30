let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d")

const GAME_BOARD_WIDTH = 480, GAME_BOARD_HEIGHT = 360;
const BALL_RADIUS = 7, GAME_RENDER_SPEED = 10;
const PADDLE_WIDTH = 85, PADDLE_HEIGHT = 10;
const SCORE_INCREASING_SPEED = 1000;
let x = 50;
let y = 50;

let dx = 2;
let dy = 2;
let paddleX = (GAME_BOARD_WIDTH - PADDLE_WIDTH) / 2;
let score = 0;
let count = 0;
let rightPressed = false;
let leftPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.keyCode === 39) {
        rightPressed = true;
    } else if (e.keyCode === 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode === 39) {
        rightPressed = false;
    } else if (e.keyCode === 37) {
        leftPressed = false;
    }
}

function Score() {
    this.increaseScore = function () {
        count += GAME_RENDER_SPEED;
        if (count >= SCORE_INCREASING_SPEED) {
            count -= SCORE_INCREASING_SPEED;
            score++;
        }
    }
    this.resultScore = function () {
        ctx.beginPath()
        ctx.font = "16px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(`Score: ${score}`, 8, 20);
        ctx.closePath();
    }
}


function GameBoard(width, height) {
    this.width = width;
    this.height = height;
    this.drawGameBoard = function (canvas) {
        canvas.setAttribute('width', this.width);
        canvas.setAttribute('height', this.height);
    }
}

function Ball(x, y, radius, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.drawBall = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "#868e96";
        ctx.fill();
        ctx.closePath();
    }
    this.moveBall = function () {
        if (this.x + dx - BALL_RADIUS < 0 || this.x + dx + BALL_RADIUS > canvas.width) {
            dx = -dx;
        }
        if (this.y + dy - BALL_RADIUS < 0)
            dy = -dy;

        else if (this.y + dy + BALL_RADIUS > canvas.height) {
            if (this.x > paddle.paddleX && this.x < paddle.paddleX + PADDLE_WIDTH) {
                dy = -dy;
            } else {
                let overGame = confirm("GAME OVER! DO YOU REPLAY GAME?");
                Replay(overGame);
            }
        }
        this.x += dx;
        this.y += dy;
    }
}

function Replay(y) {
    if (y) {
        document.location.reload()
        clearInterval(interval);
    } else {
        alert("Your Score: " + score)
    }
}

function Paddle(paddleX, width, height) {
    this.paddleX = paddleX;
    this.width = width;
    this.height = height;
    this.drawPaddle = function () {
        ctx.beginPath();
        ctx.fillStyle = "#6610f2";
        ctx.fillRect(this.paddleX, canvas.height - this.height, this.width, this.height);
        ctx.closePath();
    }
    this.movePaddle = function () {
        if (rightPressed) {
            this.paddleX += 7;
            if (this.paddleX + PADDLE_WIDTH > canvas.width) {
                this.paddleX = canvas.width - PADDLE_WIDTH;
            }
        } else if (leftPressed) {
            this.paddleX -= 7;
            if (this.paddleX < 0) {
                this.paddleX = 0;
            }
        }
    }

}

let gameBoard = new GameBoard(GAME_BOARD_WIDTH, GAME_BOARD_HEIGHT);
let ball = new Ball(x, y, BALL_RADIUS, GAME_RENDER_SPEED);
let paddle = new Paddle(paddleX, PADDLE_WIDTH, PADDLE_HEIGHT);
let scoreCell = new Score()


function drawGame() {
    gameBoard.drawGameBoard(canvas);
    ball.drawBall(x, y, BALL_RADIUS, GAME_RENDER_SPEED);
    ball.moveBall();
    paddle.drawPaddle(paddleX, PADDLE_WIDTH, PADDLE_HEIGHT);
    paddle.movePaddle();
    scoreCell.increaseScore();
    scoreCell.resultScore()
}

const interval = setInterval(drawGame, GAME_RENDER_SPEED)