// Constants for Pong
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

// Hitting constants
const HIT_CAP = 2; // number of frames that can be hit for
const HIT_DELAY_TIME = 70; // time between hits
const HIT_MULTIPLIER = 5; // multiplies ball velocity when hit by this number
const HIT_ADD = 0; // amount of velocity to add when hit (after multiplier)
const HIT_PAUSE_TIME = 20; // time to stop the game for
const HIT_SPEED_TIMES = 30; // amount of time for which hit speed is up
const HIT_P_MULT = 2; // multiplier for speed of paddle for HIT_SPEED_TIMES after hit

// Variables for Pong
let paddleXV = 0; // Player paddle velocity
let aiPaddleXV = 0; // AI paddle velocity
let paddleLeft = false; // self explanatory
let paddleRight = false;
let ballXV = BALL_SPEED; // X (left-right) velocity of ball
let ballZV = BALL_SPEED; // Z (up-down) velocity of ball
let ballAV = 0; // Angular velocity of ball
let aiScore = 0;
let userScore = 0;
let win = false;
let lose = false;
let paused = false;

// Ball hitting code
let hitFrame = 0; // which frame the hit was on
let hitDelay = 0; // time between hits
let hit = false; // unused, idk why its here
let hitPause = 0; // pauses game when ball hit
let hitSpeedFrames = 0; // frames after hit which have speed up

// Things for AI to hit
let totalBounce = 1;
let succHit = 0;

// UI Colors
const HIT_BLUE = "#00BBFF";
const HIT_RED = "FC0324";
const HIT_GREEN = "5EFC03";

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function update() {
    updateEnd();
    hitPause--;
    if (!win && !lose && !paused && hitPause <= 0) { // check if update possible
        updateUserPaddle();
        // hitting
        let hitMeter = document.getElementById("HitMeter1"); // get hit meter to update UI
        if (hitFrame > 0) {
            hitMeter.style.backgroundColor = HIT_BLUE;
            if (hitFrame > HIT_CAP) { // stop hitting if higher than hit cap
                hitDelay = HIT_DELAY_TIME;
                hitFrame = 0;
            } else { hitFrame++; } // increment frame
        }
        // decrement the things if nessecary
        if (hitDelay > 0) { hitDelay--; }
        if (hitSpeedFrames > 0) { hitSpeedFrames--; }

        // Update Hit Meter
        if (hitFrame == 0) {
            let hitWidth = (100 * (1 - (hitDelay / HIT_DELAY_TIME))).toString() + "%";
            let hitColor = "#" + linColorInterp(HIT_RED, HIT_GREEN, 1- hitDelay / HIT_DELAY_TIME);
            hitMeter.style.width = hitWidth;
            hitMeter.style.backgroundColor = hitColor;
        }
        // Update physics
        updateAiPaddle();
        updateBall();

        console.log(succHit / totalBounce);
    }
}

function keyDown(/** @type {keyboardEvent} */ ev) {
    switch (ev.keyCode) {
        case 37: // Left arrow
        case 65: // A
            paddleLeft = true;
            break;
        case 39: // Right arrow 
        case 68: // D
            paddleRight = true;
            break;
        case 32: // Space
            if (hitDelay == 0) {
                hitFrame = 1;
            }
            break;
        case 80: // P
            paused = !paused;
            break;
    }
}

function keyUp(/** @type {keyboardEvent} */ ev) {
    switch (ev.keyCode) {
        case 37: // Left arrow
        case 65: // A
            paddleLeft = false;
            break;
        case 39: // Right arrow
        case 68: // D
            paddleRight = false;
            break;
        case 38: // Up arrow
        case 87: // W
            if (PADDLE_SPEED < 80) {
                PADDLE_SPEED += 10;
            }
            break;
        case 40: // Down arrow
        case 83: // S
            if (PADDLE_SPEED > 40) {
                PADDLE_SPEED -= 10;
            }
            break;
    }
}

function updateUserPaddle() {
    // check which keys are being held down, update paddle motion
    if (paddleLeft && !paddleRight) {
        paddleXV = -PADDLE_SPEED * timeDelta;
    } else if (!paddleLeft && paddleRight) {
        paddleXV = PADDLE_SPEED * timeDelta;
    } else {
        paddleXV = 0;
    }
    // speed up paddle after hit
    if (hitSpeedFrames > 0) { paddleXV *= 2; }
    // update paddle position
    userPad.position.x += paddleXV;
    // check if paddle has hit wall
    if (userPad.position.x < -(TABLE_W / 2) + (PADDLE_W / 2)) { // left
        userPad.position.x = -(TABLE_W / 2) + (PADDLE_W / 2);
    } else if (userPad.position.x > (TABLE_W / 2) - (PADDLE_W / 2)) { // right
       userPad.position.x = (TABLE_W / 2) - (PADDLE_W / 2);
    }
}

function updateAiPaddle() {
    // move paddle towards ball
    // TODO: improve ai paddle
    if (ball.position.x < aiPad.position.x - 0.5) {
        aiPaddleXV = -AI_PADDLE_SPEED * timeDelta;
    } else if (ball.position.x > aiPad.position.x + 0.5) {
        aiPaddleXV = AI_PADDLE_SPEED * timeDelta;
    } else {
        aiPaddleXV = 0;
    }
    // speed up paddle after hit
    if (hitSpeedFrames > 0) { aiPaddleXV *= 2; }
    // update paddle position
    aiPad.position.x += aiPaddleXV;
    // check if paddle has hit wall
    if (aiPad.position.x < -(TABLE_W / 2) + (PADDLE_W / 2)) { // left
        aiPad.position.x = -(TABLE_W / 2) + (PADDLE_W / 2);
    } else if (aiPad.position.x > (TABLE_W / 2) - (PADDLE_W / 2)) { // right
        aiPad.position.x = (TABLE_W / 2) - (PADDLE_W / 2);
    }
}

function ballVelocityCurve(vel) {

    vel = Math.abs(vel);

    // cap at which each parabola begins
    let threshold1 = 0.01;
    let threshold2 = 0.10;
    let threshold3 = 0.99;

    // drag is determined by parabolas
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

    // more parabolas
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
    let v = (ballXV * ballXV) + (ballZV * ballZV); // magnitude^2
    let vDir = Math.atan(ballZV / ballXV) + (Math.PI * (ballXV < 0 ? 1 : 0)); // direction

    // Calculate Magnus force and acceleration
    let Fm = 0.5 * CL * AIR_DENSE * A * v * (Math.sqrt(v) * (ballAV * Math.PI / 180));
    let FmDir = vDir + (Math.PI / 2 * Math.sign(ballAV));

    // Apply Threshold for Maximum Magnus Force
    Fm = Fm.clamp(-90, 90);

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

    // Ball hit player paddle
    if (ball.position.z + (BALL_W / 2) > userPad.position.z - (PADDLE_H / 2)
        && ball.position.z - (BALL_W / 2) < userPad.position.z + (PADDLE_H / 2)
        && ball.position.x - (BALL_W / 2) < userPad.position.x + (PADDLE_W / 2)
        && ball.position.x + (BALL_W / 2) > userPad.position.x - (PADDLE_W / 2)
    ) {
        ball.position.z = userPad.position.z - 3;
        let fk = (-2 * M * UK * ballZV) / COL_TIME;
        ballAV -= ((-R * fk * COL_TIME) / ROT_I);
        ballXV -= fk * COL_TIME / M;
        ballXV -= Math.sign(ballXV) * paddleXV * SIDE_VEL;
        ballZV = -ballZV - (HIT_VEL * Math.abs(paddleXV));

        // hitting
        if (hitFrame > 0) { hitBall(); }
        totalBounce++;

    }

    // Ball hit AI paddle
    if (ball.position.z - (BALL_W / 2) < aiPad.position.z + (PADDLE_H / 2) 
        && ball.position.z + (BALL_W / 2) > aiPad.position.z - (PADDLE_H / 2)
        && ball.position.x - (BALL_W / 2) < aiPad.position.x + (PADDLE_W / 2)
        && ball.position.x + (BALL_W / 2) > aiPad.position.x - (PADDLE_W / 2)
    ) {
        ball.position.z = aiPad.position.z + 3;
        let fk = (-2 * M * UK * ballZV) / COL_TIME;
        ballAV -= ((-R * fk * COL_TIME) / ROT_I);
        ballXV -= fk * COL_TIME / M;
        ballXV -= Math.sign(ballXV) * aiPaddleXV * SIDE_VEL;
        ballZV = -ballZV + (HIT_VEL * Math.abs(aiPaddleXV));

        if (Math.random() < (succHit / totalBounce)) {
            hitBall();
            totalBounce++;
        }
    }    

    // Ball Hit Walls
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

    // Ball scored
    if (ball.position.z > GOAL_H ) {
        aiScore++;
        if (!win && !lose) {
            newBall();
        }
    } else if (ball.position.z < -GOAL_H) {
        userScore++;
        if (!win && !lose) {
            newBall();
        }
    }
}

function hitBall() {
    hitPause = HIT_PAUSE_TIME;
    hit = true;

    ballAV *= HIT_MULTIPLIER;
    ballXV *= HIT_MULTIPLIER;
    ballZV *= HIT_MULTIPLIER;

    ballAV += HIT_ADD;
    ballXV += HIT_ADD;
    ballZV += HIT_ADD;

    hitSpeedFrames += HIT_SPEED_TIMES;

    succHit++;
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

function updateEnd() {
    if (userScore >= 7 && Math.abs(aiScore - userScore) >= 2) {
        win = true;
        ballXV = 0;
        ballYV = 0;
        ballAV = 0;
        document.getElementById("PlayerWin").style.visibility = "visible";
    }
    if (aiScore >= 7 && Math.abs(aiScore - userScore) >= 2) {
        lose = true;
        ballXV = 0;
        ballYV = 0;
        ballAV = 0;
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
