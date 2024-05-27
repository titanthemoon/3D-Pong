const MIN_BOUNCE_ANGLE = 30;
const BALL_SPIN = 2;
const PADDLE_SPEED = 0.5;
const AI_PADDLE_SPEED = 0.5;
const BALL_SPEED = 0.35;
const RANDOM_EFFECT = 0.35;

let paddleXV = 0;
let ballXV = BALL_SPEED;
let ballZV = BALL_SPEED;
let aiScore = 0;
let userScore = 0;
let win = false;
let lose = false;
let paused = false;

const Direction = {
    LEFT: 0,
    RIGHT: 1,
    STOP: 2
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function update() {
    updateWin();
    updateLose();
    if (!win && !lose && !paused) {
        updateUserPaddle();
        updateAiPaddle();
        updateBall();
    }
}

function keyDown(/** @type {keyboardEvent} */ ev) {
    switch (ev.keyCode) {
        case 37:
            movePaddle(Direction.LEFT);
            break;
        case 39:
            movePaddle(Direction.RIGHT);
            break;
        case 32:
            if ( win || lose ) {
                newGame();
            }
            break;
        case 80:
            paused = !paused;
            break;
    }
}

function keyUp(/** @type {keyboardEvent} */ ev) {
    switch (ev.keyCode) {
        case 37:
            movePaddle(Direction.STOP);
            break;
        case 39:
            movePaddle(Direction.STOP);
            break;
    }
}

function movePaddle(direction) {
    switch(direction) {
        case Direction.LEFT:
            paddleXV = -PADDLE_SPEED;
            break;
        case Direction.RIGHT:
            paddleXV = PADDLE_SPEED;
            break;
        case Direction.STOP:
            paddleXV = 0;
            break;
    }
}

function updateUserPaddle() {
    userPad.position.x += paddleXV;

    if (userPad.position.x < -21.5 + 5.6) {
        userPad.position.x = -21.5 + 5.6;
    } else if (userPad.position.x > 21.5 - 5.6) {
       userPad.position.x = 21.5 - 5.6;
    }
}

function updateAiPaddle() {
    var x_target = ball.position.x;
    var diff = -((aiPad.position.x + (9 / 2)) - x_target);
    if (ball.position.x < aiPad.position.x) {
        diff = -AI_PADDLE_SPEED;
    } else if (ball.position.x > aiPad.position.x) {
        diff = AI_PADDLE_SPEED;
    }
    aiPad.position.x += diff;
    if (aiPad.position.x < -21.5 + 5.6) {
        aiPad.position.x = -21.5 + 5.6;
    } else if (aiPad.position.x > 21.5 - 5.6) {
        aiPad.position.x = 21.5 - 5.6;
    }
}

function updateBall() {

    ball.position.x += ballXV;
    ball.position.z += ballZV;

    if (ball.position.z > userPad.position.z - 3 * 0.5 - 3 * 0.5 
        && ball.position.z < userPad.position.z + 3 * 0.5
        && ball.position.x > userPad.position.x - 9 * 0.5 - 3 * 0.5
        && ball.position.x < userPad.position.x + 9 * 0.5 + 3 * 0.5
    ) {
        ball.position.z = userPad.position.z - 3;
        ballXV += ( PADDLE_SPEED / 2 ) - (Math.random() * RANDOM_EFFECT * (Math.pow(-1, Math.floor(Math.random() * 10))));
        ballZV = -ballZV - Math.random() * RANDOM_EFFECT;
    }

    if (ball.position.z > aiPad.position.z - 3 * 0.5 - 3 * 0.5 
        && ball.position.z < aiPad.position.z + 3 * 0.5
        && ball.position.x > aiPad.position.x - 9 * 0.5 - 3 * 0.5
        && ball.position.x < aiPad.position.x + 9 * 0.5 + 3 * 0.5
    ) {
        ball.position.z = aiPad.position.z + 3;
        ballXV += ( PADDLE_SPEED / 2 ) + (Math.random() * RANDOM_EFFECT * (Math.pow(-1, Math.floor(Math.random() * 10))));
        ballZV = -ballZV + Math.random() * RANDOM_EFFECT;
    }    

    if (ball.position.x < -21.5 + 3.45 ) {
        ball.position.x = -21.5 + 3.46;
        ballXV = -ballXV;
    } else if (ball.position.x > 21.5 - 3.45 ) {
        ball.position.x = 21.5 - 3.46;
        ballXV = -ballXV;
    }

    if (ball.position.z > 29.5 ) {
        aiScore++;
        document.getElementById("AIScore").innerHTML = aiScore;
        document.getElementById("PlayerScore").innerHTML = userScore;
        if (!win && !lose) {
            newBall();
        }
    } else if (ball.position.z < -29.5) {
        userScore++;
        document.getElementById("AIScore").innerHTML = aiScore;
        document.getElementById("PlayerScore").innerHTML = userScore;
        if (!win && !lose) {
            newBall();
        }
    }
}

function applyBALL_SPEED(angle) {
    ballXV = BALL_SPEED * Math.cos(angle);
    ballYV = -BALL_SPEED * Math.sin(angle);
}

function newBall() {
    ballXV = BALL_SPEED;
    ballZV = BALL_SPEED;
    ball.position.z = 0;
    ball.position.x = 0;
}

function updateWin() {
    if (userScore >= 7 && Math.abs(aiScore - userScore) >= 2) {
        ballXV = 0;
        ballYV = 0;
        win = true;
    }
}

function updateLose() {
    if (aiScore >= 7 && Math.abs(aiScore - userScore) >= 2) {
        ballXV = 0;
        ballYV = 0;
        lose = true;
    }
}

function newGame() {
    win = false;
    lose = false;
    aiScore = 0;
    userScore = 0;
    userPad.position.x = 0;
    aiPad.position.x = 0;
    newBall();
}

function move (x, z) {
    aiPad.position.x += x;
    aiPad.position.z += z;
}