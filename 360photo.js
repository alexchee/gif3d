function startTHREE(gif)
// function startTHREE(texture)
{
    const fps = 14;
    var currentMesh;
    var camera, scene, renderer;
    var scenes = [];
    const maxFrames = 200;
    var currentFrame = 0;

    var fov = 70,
    texture_placeholder,
    isUserInteracting = false,
    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0;

    init();
    animate();

    function init() {

        var cont, mesh;

        gif.setFps(fps);

        cont = document.getElementById( 'cont' );

        camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 1100 );
        camera.target = new THREE.Vector3( 0, 0, 0 );

        scene = new THREE.Scene();

        // Try to create an inverted sphere, then swap texture
        const material = gif.getMaterial();
        var sphereGeo = new THREE.SphereGeometry( 500, 60, 40 );
        currentMesh = new THREE.Mesh( sphereGeo, material );
        currentMesh.scale.x = -1
        scene.add(currentMesh);

        updateMeshMaterial();

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        cont.appendChild( renderer.domElement );

        document.addEventListener( 'mousedown', onDocumentMouseDown, false );
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'mouseup', onDocumentMouseUp, false );
        document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
        document.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false);

        //

        window.addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function onDocumentMouseDown( event ) {

        event.preventDefault();

        isUserInteracting = true;

        onPointerDownPointerX = event.clientX;
        onPointerDownPointerY = event.clientY;

        onPointerDownLon = lon;
        onPointerDownLat = lat;

    }

    function onDocumentMouseMove( event ) {

        if ( isUserInteracting ) {

            lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
            lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

        }
    }

    function onDocumentMouseUp( event ) {

        isUserInteracting = false;

    }

    function onDocumentMouseWheel( event ) {

        // WebKit

        if ( event.wheelDeltaY ) {

            fov -= event.wheelDeltaY * 0.05;

        // Opera / Explorer 9

        } else if ( event.wheelDelta ) {

            fov -= event.wheelDelta * 0.05;

        // Firefox

        } else if ( event.detail ) {

            fov += event.detail * 1.0;

        }

        camera.projectionMatrix.makePerspective( fov, window.innerWidth / window.innerHeight, 1, 1100 );
        render();

    }

    // studders alot
    function updateMeshMaterial() {
      gif.update();
      currentMesh.material = gif.getMaterial();
    }

    function animate() {
        requestAnimationFrame( animate );

        updateMeshMaterial()
        render();

    }

    function render() {

        lat = Math.max( - 85, Math.min( 85, lat ) );
        phi = ( 90 - lat ) * Math.PI / 180;
        theta = lon * Math.PI / 180;

        camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
        camera.target.y = 500 * Math.cos( phi );
        camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

        camera.lookAt( camera.target );

        /*
        // distortion
        camera.position.x = - camera.target.x;
        camera.position.y = - camera.target.y;
        camera.position.z = - camera.target.z;
        */

        // renderer.clean();
        renderer.render( scene, camera );

    }
}
