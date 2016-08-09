//--------------------------------------------------------------------------------------------------------
// @author Jordi Ros: shine.3p@gmail.com
//
// GLGif.js
//
// Modified to return Materials instead
//--------------------------------------------------------------------------------------------------------

function loadGif(img, onload) {
	// Init
	var gif = {};
	// gif.tex = [];
	gif.materials = [];
	gif.frame = 0;
	gif.loaded = false;
	gif.length = 1;
	gif.timer = new Timer();
	gif.reset = function() {
		this.timer.reset();
	}
	gif.setFps = function(fps) {
		this.length = this.materials.length / fps;
	}
	gif.setLength = function(length) {
		this.length = length;
	}
	gif.update = function() {
		this.timer.update();
		var f = (this.timer.time + this.timer.delta) % this.length;

		this.frame = Math.floor((f / this.length) * this.materials.length);
	}

	gif.getMaterial = function() {
		return this.materials[this.frame];
	}

	// loadImage
	var canvas, ctx;
	var hdr;
	var tcanvas;

	// Do nothing
	var doNothing = function() {};

	// Do header
	var doHdr = function(_hdr) {
		hdr = _hdr;
	};

	var doGCE = function(gce) {
		canvas = document.createElement('canvas');
		canvas.width = hdr.width;
		canvas.height = hdr.height;
		ctx = canvas.getContext('2d');
	};

	// Do Image
	var doImg = function(img) {
		// Load pixels
		var ct = img.lctFlag ? img.lct : hdr.gct;
		var cData = ctx.getImageData(img.leftPos, img.topPos, img.width, img.height);
		img.pixels.forEach(function(pixel, i) {
			cData.data[i * 4 + 0] = ct[pixel][0];
			cData.data[i * 4 + 1] = ct[pixel][1];
			cData.data[i * 4 + 2] = ct[pixel][2];
			cData.data[i * 4 + 3] = 255;
		});
		ctx.putImageData(cData, img.leftPos, img.topPos);
		ctx.drawImage(canvas, 0, 0, img.width, img.height);

		// Create THREE texture
		var texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;
		// works but ineffecient
		// gif.tex.push(texture);

		// So so bad if adding, and deleting meshes
		// var mesh = new THREE.Mesh( new THREE.SphereGeometry( 500, 60, 40 ), new THREE.MeshBasicMaterial( { map: texture } ) );
		// mesh.scale.x = -1;
		// gif.meshes.push(mesh);

		// Try to make materials
		gif.materials.push(new THREE.MeshBasicMaterial( { map: texture } ));
	};

	var doEof = function(block) {
		gif.loaded = true;
		gif.reset();
		if (onload)
			onload(gif);
	}

	// Gif Handler
	var gifHandler = {
		hdr: doHdr,
		gce: doGCE,
		com: doNothing,
		app: { NETSCAPE: doNothing },
		img: doImg,
		eof: doEof,
	};

	var xhr = new XMLHttpRequest();
	xhr.open("GET", img, true);
	xhr.overrideMimeType('text/plain; charset=x-user-defined');
	xhr.onload = function(e) {
		var buffer = xhr.responseText;
		parseGIF(new Stream(buffer), gifHandler);
	};
	xhr.send(null);

	return gif;
}
