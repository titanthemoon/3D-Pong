var floorGeo = new THREE.BoxGeometry(40, 1, 60);
var floorMaterial = new THREE.MeshLambertMaterial({color: 0x32586b});
var floor = new THREE.Mesh(floorGeo, floorMaterial);
floor.position.y = -2.5;
scene.add(floor);

var topGeo = new THREE.BoxGeometry(40, 3, 3);
var topMaterial = new THREE.MeshLambertMaterial({color: 0x7b7f7c});
var topWall = new THREE.Mesh(topGeo, topMaterial);
topWall.position.z = -31.5;
topWall.position.y = -0.5;
scene.add(topWall);

var bottomGeo = new THREE.BoxGeometry( 40, 3, 3 );
var bottomMaterial = new THREE.MeshLambertMaterial({color: 0x7b7f7c});
var bottomWall = new THREE.Mesh(bottomGeo, bottomMaterial);
bottomWall.position.z = 31.5;
bottomWall.position.y = -0.5;
scene.add(bottomWall);

var leftGeo = new THREE.BoxGeometry(3, 3, 66);
var leftMaterial = new THREE.MeshLambertMaterial({color: 0x7b7f7c});
var leftWall = new THREE.Mesh(leftGeo, leftMaterial);
leftWall.position.y = -0.5;
leftWall.position.x = -21.5;
scene.add(leftWall);

var rightGeo = new THREE.BoxGeometry(3, 3, 66);
var rightMaterial = new THREE.MeshLambertMaterial({color: 0x7b7f7c});
var rightWall = new THREE.Mesh(rightGeo, rightMaterial);
rightWall.position.y = -0.5;
rightWall.position.x = 21.5;
scene.add(rightWall);

var netGeo = new THREE.BoxGeometry(40, 0.5, 1) 
var netMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
var net = new THREE.Mesh(netGeo, netMaterial);
net.position.y = -2;
scene.add(net);

var userPadGeo = new THREE.BoxGeometry(9, 3, 3);
var userPadMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
var userPad = new THREE.Mesh(userPadGeo, userPadMaterial);
userPad.position.y = -0.5;
userPad.position.z = 27.5;
scene.add(userPad);

var aiPadGeo = new THREE.BoxGeometry(9, 3, 3);
var aiPadMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
var aiPad = new THREE.Mesh(aiPadGeo, aiPadMaterial);
aiPad.position.y = -0.5;
aiPad.position.z = -27.5;
scene.add(aiPad);

var ballGeo = new THREE.BoxGeometry(3, 3, 3);
var ballMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
var ball = new THREE.Mesh(ballGeo, ballMaterial);
ball.position.x = 0;
ball.position.z = 0;
ball.rotation.y = 0;
scene.add(ball);