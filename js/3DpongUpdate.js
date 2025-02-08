const MIN_BOUNCE_ANGLE = 30;
const BALL_SPIN = 2;
let PADDLE_SPEED = 40; // I know this is kind of disgusting
const AI_PADDLE_SPEED = 50;
const BALL_SPEED = 21;
const SIDE_VEL = 10;
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
        case 65:
            paddleLeft = true;
            break;
        case 39:
        case 68:
            paddleRight = true;
            break;
        case 32:
            if (win || lose) {
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
        case 65:
            paddleLeft = false;
            break;
        case 39:
        case 68:
            paddleRight = false;
            break;
        case 38:
        case 87:
            if (PADDLE_SPEED < 80) {
                PADDLE_SPEED += 10;
            }
            break;
        case 40:
        case 83:
            if (PADDLE_SPEED > 40) {
                PADDLE_SPEED -= 10;
            }
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

    if (userPad.position.x < -(TABLE_W / 2) + (PADDLE_W / 2)) {
        userPad.position.x = -(TABLE_W / 2) + (PADDLE_W / 2);
    } else if (userPad.position.x > (TABLE_W / 2) - (PADDLE_W / 2)) {
       userPad.position.x = (TABLE_W / 2) - (PADDLE_W / 2);
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
    if (aiPad.position.x < -(TABLE_W / 2) + (PADDLE_W / 2)) {
        aiPad.position.x = -(TABLE_W / 2) + (PADDLE_W / 2);
    } else if (aiPad.position.x > (TABLE_W / 2) - (PADDLE_W / 2)) {
        aiPad.position.x = (TABLE_W / 2) - (PADDLE_W / 2);
    }
}

function ballVelocityCurve(vel) {

    vel = Math.abs(vel);

    let threshold1 = 0.01;
    let threshold2 = 0.10;
    let threshold3 = 0.99;

    if (vel <= 50) {
        return threshold1;
    } else if (vel <= 100) {
        return ((threshold2 - threshold1) / (50 * 50) * ((vel - 50) * (vel - 50)) + threshold1);
    } else if (vel <= 130) {
        return ((threshold3 - threshold2) / (30 * 30) * ((vel - 100) * (vel - 100)) + threshold2);
    } else {
        return threshold3;
    }
}

function ballAngVelocityCurve(vel) {

    vel = Math.abs(vel);

    let threshold1 = 0.01;
    let threshold2 = 0.50;
    let threshold3 = 0.99;

    if (vel <= 30) {
        return threshold1;
    } else if (vel <= 60) {
        return ((threshold2 - threshold1) / (30 * 30) * ((vel - 30) * (vel - 30)) + threshold1);
    } else if (vel <= 90) {
        return ((threshold3 - threshold2) / (30 * 30) * ((vel - 60) * (vel - 60)) + threshold2);
    } else {
        return threshold3;
    }
}

function updateBall() {

    // Some things needed for calculations
    let v = (ballXV * ballXV) + (ballZV * ballZV);
    let vDir = Math.atan(ballZV / ballXV) + (Math.PI * (ballXV < 0 ? 1 : 0));

    // Calculate Magnus force and acceleration
    let Fm = 0.5 * CL * AIR_DENSE * A * v * (Math.sqrt(v) * (ballAV * Math.PI / 180));
    let FmDir = vDir + (Math.PI / 2 * Math.sign(ballAV));

    // Apply Threshold for Maximum Magnus Force
    if (Math.abs(Fm) > 90) {
        Fm = Math.sign(Fm) * 90;
    }

    // Apply acceleration from Magnus force
    ballXV += (Fm / M) * Math.cos(FmDir) * timeDelta;
    ballZV += (Fm / M) * Math.sin(FmDir) * timeDelta;

    // Apply acceleration from drag
    ballXV -= ballXV * ballVelocityCurve(ballXV) * timeDelta;
    ballZV -= ballZV * ballVelocityCurve(ballZV) * timeDelta;

    // Calculate conservation of energy to reduce spin
    ballAV -= ballAV * ballAngVelocityCurve(ballAV) * timeDelta;

    // Apply velocity
    ball.position.x += ballXV * timeDelta;
    ball.position.z += ballZV * timeDelta;
    ball.rotation.y += ballAV * timeDelta;

    if (ball.position.z + (BALL_W / 2) > userPad.position.z - (PADDLE_H / 2) 
        && ball.position.x - (BALL_W / 2) < userPad.position.x + (PADDLE_W / 2)
        && ball.position.x + (BALL_W / 2) > userPad.position.x - (PADDLE_W / 2)
    ) {
        ball.position.z = userPad.position.z - 3;
        let fk = (-2 * M * UK * ballZV) / COL_TIME;
        ballAV -= ((-R * fk * COL_TIME) / ROT_I);
        ballXV -= fk * COL_TIME / M;
        ballXV -= Math.sign(ballXV) * paddleXV * SIDE_VEL;
        ballZV = -ballZV - (HIT_VEL * Math.abs(paddleXV));
    }

    if (ball.position.z - (BALL_W / 2) < aiPad.position.z + (PADDLE_H / 2) 
        && ball.position.x - (BALL_W / 2) < aiPad.position.x + (PADDLE_W / 2)
        && ball.position.x + (BALL_W / 2) > aiPad.position.x - (PADDLE_W / 2)
    ) {
        ball.position.z = aiPad.position.z + 3;
        let fk = (-2 * M * UK * ballZV) / COL_TIME;
        ballAV -= ((-R * fk * COL_TIME) / ROT_I);
        ballXV -= fk * COL_TIME / M;
        ballXV -= Math.sign(ballXV) * aiPaddleXV * SIDE_VEL;
        ballZV = -ballZV + (HIT_VEL * Math.abs(aiPaddleXV));
    }    

    if (ball.position.x < -(TABLE_W / 2) + (BALL_W / 2)) {
        let fk = (-2 * M * UK * ballXV) / COL_TIME;
        ball.position.x = -(TABLE_W / 2) + (BALL_W / 2);
        ballXV = -ballXV;
        ballAV -= ((-R * fk * COL_TIME) / ROT_I);
        ballZV -= fk * COL_TIME / M;
        
    } else if (ball.position.x > (TABLE_W / 2) - (BALL_W / 2)) {
        let fk = (-2 * M * UK * ballXV) / COL_TIME;
        ball.position.x = (TABLE_W / 2) - (BALL_W / 2);
        ballXV = -ballXV;
        ballAV -= ((-R * fk * COL_TIME) / ROT_I);
        ballZV -= fk * COL_TIME / M;
    }

    if (ball.position.z > 29.5 ) {
        aiScore++;
        if (!win && !lose) {
            newBall();
        }
    } else if (ball.position.z < -29.5) {
        userScore++;
        if (!win && !lose) {
            newBall();
        }
    }
}

function newBall() {

    document.getElementById("AIScore").innerHTML = aiScore;
    document.getElementById("PlayerScore").innerHTML = userScore;

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
        document.getElementById("PlayerWin").style.visibility = "visible";
    }
}

function updateLose() {
    if (aiScore >= 7 && Math.abs(aiScore - userScore) >= 2) {
        ballXV = 0;
        ballYV = 0;
        lose = true;
        document.getElementById("PlayerLose").style.visibility = "visible";
    }
}

function newGame() {
    document.getElementById("PlayerWin").style.visibility = "hidden";
    document.getElementById("PlayerLose").style.visibility = "hidden";
    win = false;
    lose = false;
    aiScore = 0;
    userScore = 0;
    userPad.position.x = 0;
    aiPad.position.x = 0;
    newBall();
}
