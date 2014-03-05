$(window).load(function() {
	var img = $('#image')[0];
	var canvas = $('<canvas/>')[0],
		context = canvas.getContext('2d');
	canvas.width = img.width;
	canvas.height = img.height;
	context.drawImage(img, 0, 0, img.width, img.height);
	
	//img.remove();
	document.body.appendChild(canvas);

	var camera, scene, renderer, controls;
	var geometry, material, mesh;

	init();
	animate();

	function init() {
		
		camera = new THREE.OrthographicCamera(-img.width * 2, img.width * 2, -img.height * 2, img.height * 2, -500, 10000);
		
		//camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
		controls = new THREE.TrackballControls(camera);
		
		camera.position.z = 500;
		camera.rotation.y = -Math.PI / 4;
		
		controls.noZoom = false;
		
		controls.addEventListener( 'change', render );

		scene = new THREE.Scene();

		geometry = new THREE.CubeGeometry( 1, 1, 1 );
		
		for (var x = 0; x < img.width; x++) {
			for (var y = 0; y < img.height; y++) {
				var pixel = context.getImageData(x, y, 1, 1).data;
				material = new THREE.MeshBasicMaterial( { color: pixel[0] << 16 | pixel[1] << 8 | pixel[2] } );
				mesh = new THREE.Mesh( geometry, material );
				mesh.position = new THREE.Vector3(x - img.width / 2, -(y + img.height / 2), Math.random() * -5);
				scene.add( mesh );
			}
		}				

		renderer = new THREE.CanvasRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );

		document.body.appendChild( renderer.domElement );

	}

	function animate() {

		// note: three.js includes requestAnimationFrame shim
		requestAnimationFrame( animate );
		controls.update();

	}
	
	function render() {
		renderer.render( scene, camera );
	}
});