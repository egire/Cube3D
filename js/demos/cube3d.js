var container, stats;

var camera, scene, renderer;

var pointLight;

var clock, time = 0, delta = 0.0;

var group = new THREE.Object3D();

var tracks = 20;

var frame = 0;

function onLoad() {
    init();
    animate();
}

function init() {
    container = document.getElementById( 'canvas' );
    document.body.appendChild( container );
    
    clock = new THREE.Clock();
    
    camera = new THREE.PerspectiveCamera( 70, container.offsetWidth  / container.offsetHeight, 1, 1000 );
    
    camera.position.y = 0;
    camera.position.z = 200;

    scene = new THREE.Scene();
    
    // create a point light
    pointLight = new THREE.SpotLight(0xFFFFFF, 1, 0, degToRad(45.0), 7.0);

    // set its position
    pointLight.position.x = 0;
    pointLight.position.y = 0;
    pointLight.position.z = 200;

    scene.add(pointLight);
    
    generateCubes( tracks );
    
    group.rotation.x = degToRad(-35.0);
    group.rotation.z = degToRad(-45.0);
    
    scene.add( group );

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0x000000 );
    renderer.setSize( container.offsetWidth , container.offsetHeight );

    container.appendChild( renderer.domElement );

    
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );
    
    window.addEventListener( 'resize', onWindowResize, false );

}

function randomColoredFaces( geometry ) {
    for ( var i = 0; i < geometry.faces.length; i += 2 ) {

        var hex = Math.random() * 0xffffff;
        geometry.faces[ i ].color.setHex( hex );
        geometry.faces[ i + 1 ].color.setHex( hex );

    }
}

function animate() {
    requestAnimationFrame( animate );
    
    render();
    
    stats.update();

    time = clock.getElapsedTime();
    delta = clock.getDelta();
}

function render() {

    rotateChildren( group, 0.5 );
    
    radialWaveChildren( group, 1.25 );
    
    frame += 1;
    
    renderer.render( scene, camera );
}

function onWindowResize() {

    camera.aspect = container.offsetWidth  / container.offsetHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( container.offsetWidth , container.offsetHeight );

}

function generateCubes( num )
{
    dim = 10;
    hypo = Math.sqrt(dim^2 * dim^2);
    var geometry = new THREE.BoxGeometry( dim, dim, dim );

    randomColoredFaces( geometry );

    var material = new THREE.MeshLambertMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
    
    for (r = 0; r < num*hypo; r+=hypo ) {
        cir = 2.0 * Math.PI * r;
        arc = Math.floor(cir/hypo);
        var cubes = new THREE.Object3D();
        for (i = 0.0; i < Math.PI*2.0; i += (Math.PI*2)/arc) {
            var cube = new THREE.Mesh( geometry, material );
            cube.translateX( r * hypo * Math.cos(i) );
            cube.translateY( r * hypo * Math.sin(i) );
            cubes.add( cube );
        }
        group.add( cubes );
    }
}

function rotateChildren( parent, deg ) {
    length = parent.children.length;
    for ( i = 0; i < length; i++ ) {
        parent.children[i].rotateZ( (length-i)/length * degToRad(deg) );
    }
}

function radialWaveChildren( parent, scale ) {
    length = parent.children.length;
    freq = 0.5;
    cycl = 2.0*Math.PI;
    w = cycl * freq;
    for ( i = 0; i<length; i++ ) {
        parent.children[i].translateZ( Math.cos( w*time - i/length*cycl ) * scale );
    }
}

function degToRad(deg) {
    return deg*Math.PI/180
}