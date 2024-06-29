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
var topGeo = new THREE.BoxGeometry(TABLE_W, TABLE_T + TABLE_O, TABLE_B);
var bottomGeo = new THREE.BoxGeometry(TABLE_W, TABLE_T + TABLE_O, TABLE_B);
var leftGeo = new THREE.BoxGeometry(TABLE_B, TABLE_T + TABLE_O, TABLE_H + 2 * TABLE_B);
var rightGeo = new THREE.BoxGeometry(TABLE_B, TABLE_T + TABLE_O, TABLE_H + 2 * TABLE_B);
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
// floor
floor.position.y = -2.5;

// top border
topWall.position.z = -31.5;
topWall.position.y = -0.5;

// bottom border
bottomWall.position.z = 31.5;
bottomWall.position.y = -0.5;

// left border
leftWall.position.y = -0.5;
leftWall.position.x = -21.5;

// right border
rightWall.position.y = -0.5;
rightWall.position.x = 21.5;

// net
net.position.y = -2;

// player paddle
userPad.position.y = -0.5;
userPad.position.z = 27.5;

// ai paddle
aiPad.position.y = -0.5;
aiPad.position.z = -27.5;

// ball
ball.position.x = 0;
ball.position.z = 0;
ball.rotation.y = 0;

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