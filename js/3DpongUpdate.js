const MIN_BOUNCE_ANGLE = 30;
const BALL_SPIN = 2;
const PADDLE_SPEED = 42;
const AI_PADDLE_SPEED = 30;
const BALL_SPEED = 21;
const HIT_VEL = 10;

// physics things for wall collisions
const UK = 0.1; // coefficient of kinetic friction
const M = 1; // mass of ball
const R = 1.5; // radius of ball
const ROT_I = (2 / 5) * M * R * R; // rotational intertia of ball
const COL_TIME = 1 / 30; // time of a collision

// My attempt at fluid dynamics
const CL = 0.22; // Coefficient of lift
const CD = 0.47; // Coefficient of drag
const AIR_DENSE = 1.23; // Air density
const A = 0.00426; // Cross sectional area

let paddleXV = 0;
let aiPaddleXV = 0;
let paddleLeft = false;
let paddleRight = false;
let ballXV = BALL_SPEED;
let ballZV = BALL_SPEED;
let ballAV = 0;
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
            paddleLeft = true;
            break;
        case 39:
            paddleRight = true;
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
            paddleLeft = false;
            break;
        case 39:
            paddleRight = false;
            break;
    }
}

function updateUserPaddle() {

    if (paddleLeft && !paddleRight) {
        paddleXV = -PADDLE_SPEED * timeDelta;
    } else if (!paddleLeft && paddleRight) {
        paddleXV = PADDLE_SPEED * timeDelta;
    } else {
        paddleXV = 0;
    }

    userPad.position.x += paddleXV;

    if (userPad.position.x < -21.5 + 5.6) {
        userPad.position.x = -21.5 + 5.6;
    } else if (userPad.position.x > 21.5 - 5.6) {
       userPad.position.x = 21.5 - 5.6;
    }
}

function updateAiPaddle() {
    if (ball.position.x < aiPad.position.x - 0.5) {
        aiPaddleXV = -AI_PADDLE_SPEED * timeDelta;
    } else if (ball.position.x > aiPad.position.x + 0.5) {
        aiPaddleXV = AI_PADDLE_SPEED * timeDelta;
    } else {
        aiPaddleXV = 0;
    }
    aiPad.position.x += aiPaddleXV;
    if (aiPad.position.x < -21.5 + 5.6) {
        aiPad.position.x = -21.5 + 5.6;
    } else if (aiPad.position.x > 21.5 - 5.6) {
        aiPad.position.x = 21.5 - 5.6;
    }
}

function updateBall() {

    // Some things needed for calculations
    let v = (ballXV * ballXV) + (ballZV * ballZV);
    let vDir = Math.atan(ballZV / ballXV) + (Math.PI * (ballXV < 0 ? 1 : 0));

    // Calculate Magnus force and acceleration
    let Fm = 0.5 * CL * AIR_DENSE * A * v * (Math.sqrt(v) * (ballAV * Math.PI / 180));
    let FmDir = vDir + (Math.PI / 2 * Math.sign(ballAV));

    // Apply acceleration from Magnus force
    ballXV += (Fm / M) * Math.cos(FmDir) * timeDelta;
    ballZV += (Fm / M) * Math.sin(FmDir) * timeDelta;

    // Calculate drag
    let Fd = 0.5 * AIR_DENSE * v * CD * A;

    // Apply acceleration from drag
    ballXV -= (Fd / M) * Math.cos(vDir) * Math.sign(ballXV) * timeDelta;
    ballZV -= (Fd / M) * Math.sin(vDir) * Math.sign(ballZV) * timeDelta;

    // Apply velocity
    ball.position.x += ballXV * timeDelta;
    ball.position.z += ballZV * timeDelta;
    ball.rotation.y += ballAV * timeDelta;

    if (ball.position.z > userPad.position.z - 3 * 0.5 - 3 * 0.5 
        && ball.position.z < userPad.position.z + 3 * 0.5
        && ball.position.x > userPad.position.x - 9 * 0.5 - 3 * 0.5
        && ball.position.x < userPad.position.x + 9 * 0.5 + 3 * 0.5
    ) {
        ball.position.z = userPad.position.z - 3;
        let fk = (-2 * M * UK * ballZV) / COL_TIME;
        ballAV -= ((-R * fk * COL_TIME) / ROT_I);
        ballXV -= fk * COL_TIME / M;
        ballZV = -ballZV - (HIT_VEL * Math.random());
    }

    if (ball.position.z > aiPad.position.z - 3 * 0.5 - 3 * 0.5 
        && ball.position.z < aiPad.position.z + 3 * 0.5
        && ball.position.x > aiPad.position.x - 9 * 0.5 - 3 * 0.5
        && ball.position.x < aiPad.position.x + 9 * 0.5 + 3 * 0.5
    ) {
        ball.position.z = aiPad.position.z + 3;
        let fk = (-2 * M * UK * ballZV) / COL_TIME;
        ballAV -= ((-R * fk * COL_TIME) / ROT_I);
        ballXV -= fk * COL_TIME / M;
        ballZV = -ballZV + (HIT_VEL * Math.random());
    }    

    if (ball.position.x < -21.5 + 3.45 ) {
        let fk = (-2 * M * UK * ballXV) / COL_TIME;
        ball.position.x = -21.5 + 3.46;
        ballXV = -ballXV;
        ballAV -= ((-R * fk * COL_TIME) / ROT_I);
        ballZV -= fk * COL_TIME / M;
        
    } else if (ball.position.x > 21.5 - 3.45 ) {
        let fk = (-2 * M * UK * ballXV) / COL_TIME;
        ball.position.x = 21.5 - 3.46;
        ballXV = -ballXV;
        ballAV -= ((-R * fk * COL_TIME) / ROT_I);
        ballZV -= fk * COL_TIME / M;
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
    ballAV = 0;
    ball.rotation.y = 0;
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