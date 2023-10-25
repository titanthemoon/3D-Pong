var light = new THREE.HemisphereLight( 0xFFFFFF, 0x0, 1 );
light.position.set( 0, 0.5, 0 );
scene.add( light );

var hemiHelper = new THREE.HemisphereLightHelper( light, 30 );
//scene.add( hemiHelper );