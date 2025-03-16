const gameArea = document.getElementById("gameArea");
const leftPaddle = document.getElementById("leftPaddle");
const rightPaddle = document.getElementById("rightPaddle");
const ball = document.getElementById("ball");
const leftScoreText = document.getElementById("leftScore");
const rightScoreText = document.getElementById("rightScore");
const gameOverScreen = document.getElementById("gameOver");
const winnerText = document.getElementById("winnerText");
const restartButton = document.getElementById("restartButton");

let leftScore = 0;
let rightScore = 0;
let ballDirectionX = 3;
let ballDirectionY = 3;
let ballSpeed = 2;
let ballPosX = gameArea.clientWidth / 2 - ball.offsetWidth / 2;
let ballPosY = gameArea.clientHeight / 2 - ball.offsetHeight / 2;
let rightPaddlePos = gameArea.clientHeight / 2 - rightPaddle.offsetHeight / 2;

let isGameOver = false;

// Movement of the paddles
document.addEventListener("mousemove", (event) => {
    if (event.clientY < gameArea.offsetTop || event.clientY > gameArea.offsetTop + gameArea.offsetHeight) return;
    rightPaddlePos = event.clientY - gameArea.offsetTop - rightPaddle.offsetHeight / 2;
    rightPaddle.style.top = `${rightPaddlePos}px`;
});

// Ball movement function
function updateBallPosition() {
    if (isGameOver) return;

    ballPosX += ballDirectionX * ballSpeed;
    ballPosY += ballDirectionY * ballSpeed;

    // Ball collision with top and bottom walls
    if (ballPosY <= 0 || ballPosY + ball.offsetHeight >= gameArea.clientHeight) {
        ballDirectionY = -ballDirectionY;
    }

    // Ball collision with paddles
    if (
        ballPosX <= leftPaddle.offsetWidth &&
        ballPosY >= leftPaddle.offsetTop &&
        ballPosY <= leftPaddle.offsetTop + leftPaddle.offsetHeight
    ) {
        ballDirectionX = -ballDirectionX;
    }

    if (
        ballPosX + ball.offsetWidth >= gameArea.clientWidth - rightPaddle.offsetWidth &&
        ballPosY >= rightPaddle.offsetTop &&
        ballPosY <= rightPaddle.offsetTop + rightPaddle.offsetHeight
    ) {
        ballDirectionX = -ballDirectionX;
    }

    // Ball out of bounds (left side)
    if (ballPosX <= 0) {
        rightScore++;
        if (rightScore === 3) {
            endGame("You Win!");
        }
        updateScore();
        resetBall();
    }

    // Ball out of bounds (right side)
    if (ballPosX + ball.offsetWidth >= gameArea.clientWidth) {
        leftScore++;
        if (leftScore === 3) {
            endGame("Robot Wins!");
        }
        updateScore();
        resetBall();
    }

    ball.style.left = `${ballPosX}px`;
    ball.style.top = `${ballPosY}px`;

    moveLeftPaddle();
}

// Left paddle AI movement
function moveLeftPaddle() {
    let leftPaddlePos = ballPosY - leftPaddle.offsetHeight / 2;
    leftPaddle.style.top = `${leftPaddlePos}px`;
}

// Update the score display
function updateScore() {
    leftScoreText.textContent = leftScore;
    rightScoreText.textContent = rightScore;
}

// End the game and display winner
function endGame(winner) {
    isGameOver = true;
    winnerText.textContent = winner;
    gameOverScreen.classList.remove("hidden");
}

// Reset ball position after each point
function resetBall() {
    ballPosX = gameArea.clientWidth / 2 - ball.offsetWidth / 2;
    ballPosY = gameArea.clientHeight / 2 - ball.offsetHeight / 2;
    ballDirectionX = -ballDirectionX; // Change direction after each point
}

// Restart the game
restartButton.addEventListener("click", () => {
    leftScore = 0;
    rightScore = 0;
    updateScore();
    gameOverScreen.classList.add("hidden");
    isGameOver = false;
    resetBall();
});

// Start the game loop
function gameLoop() {
    if (!isGameOver) {
        updateBallPosition();
        requestAnimationFrame(gameLoop);
    }
}

// Initialize the game
gameLoop();