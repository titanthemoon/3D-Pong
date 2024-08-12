// Colors
const FLOOR_COLOR = 0x32586b;
const WALL_COLOR = 0x7b7f7c;
const NET_COLOR = 0xff0000;
const ENTITY_COLOR = 0xffffff;

// Materials
var floorMaterial = new THREE.MeshLambertMaterial({color: FLOOR_COLOR});
var wallMaterial = new THREE.MeshLambertMaterial({color: WALL_COLOR});
var netMaterial = new THREE.MeshLambertMaterial({color: NET_COLOR});
var entityMaterial = new THREE.MeshLambertMaterial({color: ENTITY_COLOR});

// Geometries
var floorGeo = new THREE.BoxGeometry(TABLE_W, TABLE_T, TABLE_H);
var topGeo = new THREE.BoxGeometry(TABLE_W, TABLE_B_T, TABLE_B);
var bottomGeo = new THREE.BoxGeometry(TABLE_W, TABLE_B_T, TABLE_B);
var leftGeo = new THREE.BoxGeometry(TABLE_B, TABLE_B_T, TABLE_H + 2 * TABLE_B);
var rightGeo = new THREE.BoxGeometry(TABLE_B, TABLE_B_T, TABLE_H + 2 * TABLE_B);
var netGeo = new THREE.BoxGeometry(TABLE_W, NET_T, NET_H);
var userPadGeo = new THREE.BoxGeometry(PADDLE_W, PADDLE_T, PADDLE_H);
var aiPadGeo = new THREE.BoxGeometry(PADDLE_W, PADDLE_T, PADDLE_H);
var ballGeo = new THREE.BoxGeometry(BALL_W, BALL_W, BALL_W);

// Meshes
var floor = new THREE.Mesh(floorGeo, floorMaterial);
var topWall = new THREE.Mesh(topGeo, wallMaterial);
var bottomWall = new THREE.Mesh(bottomGeo, wallMaterial);
var leftWall = new THREE.Mesh(leftGeo, wallMaterial);
var rightWall = new THREE.Mesh(rightGeo, wallMaterial);
var net = new THREE.Mesh(netGeo, netMaterial);
var userPad = new THREE.Mesh(userPadGeo, entityMaterial);
var aiPad = new THREE.Mesh(aiPadGeo, entityMaterial);
var ball = new THREE.Mesh(ballGeo, entityMaterial);

// Positions
{
    // offsets used multiple times
    let borderOffest = TABLE_Y_D + (TABLE_T / 2) + (TABLE_B_T / 2);
    let paddleOffset = TABLE_Y_D + (TABLE_T / 2) + (PADDLE_T / 2);

    // floor
    floor.position.y = TABLE_Y_D;

    // top border
    topWall.position.y = borderOffest;
    topWall.position.z = -((TABLE_H / 2) + (TABLE_B / 2));

    // bottom border
    bottomWall.position.y = borderOffest;
    bottomWall.position.z = ((TABLE_H / 2) + (TABLE_B / 2));

    // left border
    leftWall.position.x = -((TABLE_W / 2) + (TABLE_B / 2));
    leftWall.position.y = borderOffest;

    // right border
    rightWall.position.x = ((TABLE_W / 2) + (TABLE_B / 2));
    rightWall.position.y = borderOffest;

    // net
    net.position.y = TABLE_Y_D + (TABLE_T / 2);

    // player paddle
    userPad.position.y = paddleOffset;
    userPad.position.z = PADDLE_Z_D;

    // ai paddle
    aiPad.position.y = paddleOffset;
    aiPad.position.z = -PADDLE_Z_D;

    // ball
    ball.position.x = 0;
    ball.position.y = TABLE_Y_D + (TABLE_T / 2) + (BALL_W / 2);
    ball.position.z = 0;
    ball.rotation.y = 0;
}

// Adding to the scene
scene.add(floor);
scene.add(topWall);
scene.add(bottomWall);
scene.add(leftWall);
scene.add(rightWall);
scene.add(net);
scene.add(userPad);
scene.add(aiPad);
scene.add(ball);