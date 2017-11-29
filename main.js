var AMOUNT = 100;
var container, stats;
var camera, scene, renderer;
var video, beat, image, imageContext,
imageReflection, imageReflectionContext, imageReflectionGradient,
texture, textureReflection, textureLeft;
var mesh;
var mouseX = 0;
// var mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );
  // var info = document.createElement( 'div' );
  // info.style.position = 'absolute';
  // info.style.top = '10px';
  // info.style.width = '100%';
  // info.style.textAlign = 'center';
  // info.innerHTML = '<a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> - video demo. playing <a href="http://durian.blender.org/" target="_blank" rel="noopener">sintel</a> trailer';
  // container.appendChild( info );
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 9000 );
  camera.position.z = 1200;
  camera.position.y = 500;
  scene = new THREE.Scene();
  // scene.background = new THREE.Color( 0xf0f0f0 );

  //Reflection
  image = document.createElement( 'canvas' );
  image.width = 362;
  image.height = 204;
  imageContext = image.getContext( '2d' );
  imageContext.fillStyle = '#000000';
  imageContext.fillRect( 0, 0, 480, 204 );



  //videotexture for the front screen
  texture = new THREE.Texture( image );
  var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
  imageReflection = document.createElement( 'canvas' );
  imageReflection.width = 362;
  imageReflection.height = 204;
  imageReflectionContext = imageReflection.getContext( '2d' );
  imageReflectionContext.fillStyle = '#000000';
  imageReflectionContext.fillRect( 0, 0, 480, 204 );
  imageReflectionGradient = imageReflectionContext.createLinearGradient( 0, 0, 0, 204 );
  // imageReflectionGradient.addColorStop( 0.2, 'rgba(240, 240, 240, 1)' );
  // imageReflectionGradient.addColorStop( 1, 'rgba(240, 240, 240, 0.15)' );

  //videotexture for the reflection
  textureReflection = new THREE.Texture( imageReflection );
  var materialReflection = new THREE.MeshBasicMaterial( { map: textureReflection, side: THREE.BackSide, overdraw: 0.5 } );

  //reflection position
  var plane = new THREE.PlaneGeometry( 380, 204, 4, 4 );
  mesh = new THREE.Mesh( plane, material );
  mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
  scene.add(mesh);
  mesh = new THREE.Mesh( plane, materialReflection );
  mesh.position.y = -140;
  mesh.position.z = 400;
  mesh.rotation.x = - Math.PI;
  mesh.rotation.x = THREE.Math.degToRad( 90 )
  mesh.rotation.z = Math.PI;
  mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.6;
  scene.add( mesh );
  video = document.getElementById( 'video' );

  //left screen
  // var plan = new THREE.PlaneGeometry (50, 50, 1, 1);
  var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
  mesh = new THREE.Mesh( plane, material);
  mesh.position.x = -620;
  mesh.position.y = 5;
  mesh.position.z = 350;
  mesh.rotation.y = -43;
  mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.6;
  scene.add(mesh);
  // beat = document.getElementById( 'beats' );
  // textureLeft = new Three.VideoTexture ( beat );


  //right fullScreen
  var plan = new THREE.PlaneGeometry (200, 400, 4, 4);
  var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
  mesh = new THREE.Mesh( plane, material);
  mesh.position.x = 620;
  mesh.position.y = 5;
  mesh.position.z = 350;
  mesh.rotation.y = 43;
  mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.6;
  scene.add(mesh);

  //dot floor
  var separation = 150;
  var amountx = 10;
  var amounty = 10;
  var PI2 = Math.PI * 2;
  var material = new THREE.SpriteCanvasMaterial( {
    color: 0x0808080,
    program: function ( context ) {
      context.beginPath();
      context.arc( 0, 0, 0.5, 0, PI2, true );
      context.fill();
    }
  } );
  for ( var ix = 0; ix < amountx; ix++ ) {
    for ( var iy = 0; iy < amounty; iy++ ) {
      var sprite = new THREE.Sprite( material );
      sprite.position.x = ix * separation - ( ( amountx * separation ) / 2 );
      sprite.position.y = -153;
      sprite.position.z = iy * separation - ( ( amounty * separation ) / 2 );
      sprite.scale.setScalar( 2 );
      scene.add( sprite );
    }
  }
  renderer = new THREE.CanvasRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  stats = new Stats();
  container.appendChild( stats.dom );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  //
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseMove( event ) {
  mouseX = ( event.clientX - windowHalfX );
  mouseY = ( event.clientY - windowHalfY ) * 0.01;

}
//
function animate() {
  requestAnimationFrame( animate );
  render();
  stats.update();
}
function render() {
  camera.position.x += ( mouseX - camera.position.x ) * 0.05;
  camera.position.y += ( - mouseY - camera.position.y ) ;
  camera.lookAt( scene.position );
  if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
    imageContext.drawImage( video, 0, 0 );
    if ( texture ) texture.needsUpdate = true;
    if ( textureReflection ) textureReflection.needsUpdate = true;
  }
  imageReflectionContext.drawImage( image, 0, 0 );
  imageReflectionContext.fillStyle = imageReflectionGradient;
  imageReflectionContext.fillRect( 0, 0, 480, 204 );
  renderer.render( scene, camera );
}
