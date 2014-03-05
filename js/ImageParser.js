var ImageParser = (function() {
	function rgb2hsv () {
	    var rr, gg, bb,
	        r = arguments[0] / 255,
	        g = arguments[1] / 255,
	        b = arguments[2] / 255,
	        h, s,
	        v = Math.max(r, g, b),
	        diff = v - Math.min(r, g, b),
	        diffc = function(c){
	            return (v - c) / 6 / diff + 1 / 2;
	        };

	    if (diff == 0) {
	        h = s = 0;
	    } else {
	        s = diff / v;
	        rr = diffc(r);
	        gg = diffc(g);
	        bb = diffc(b);

	        if (r === v) {
	            h = bb - gg;
	        }else if (g === v) {
	            h = (1 / 3) + rr - bb;
	        }else if (b === v) {
	            h = (2 / 3) + gg - rr;
	        }
	        if (h < 0) {
	            h += 1;
	        }else if (h > 1) {
	            h -= 1;
	        }
	    }
	    return {
	        h: Math.round(h * 360),
	        s: Math.round(s * 100),
	        v: Math.round(v * 100)
	    };
	};

	function ImageParser(config) {
		var emptyFn = function() {},
			start = config.start || emptyFn,
			parse = config.parse || emptyFn,
			end = config.end || emptyFn;
			
		var fileSizeInBytes = 0,
			numParsedPoints = 0,
			numTotalPoints = 0,
			progress = 0;
			
		this.__defineGetter__("version", function() { return "0.1"; });
		this.__defineGetter__("numParsedPoints", function() { return numParsedPoints; });
		this.__defineGetter__("numTotalPoints", function() { return numTotalPoints; });
		this.__defineGetter__("progress", function() { return progress; });
		this.__defineGetter__("fileSize", function() { return fileSizeInBytes; });
		
		this.load = function(path) {
			var image = new Image(),
				parser = this;
			
			image.src = path;
			image.onload = function() {
				start(parser);
				
				var canvas = $('<canvas/>')[0],
					context = canvas.getContext('2d'),
					width = image.width,
					height = image.height;
					
				canvas.width = width;
				canvas.height = height;
				context.drawImage(image, 0, 0, width, height);
				
				var aspect = width / height,
					hWidth = width / 2,
					hHeight = height / 2;
				
				numTotalPoints = width * height;
				
				var verts = new Float32Array(height * width * 3),
						colors = new Float32Array(height * width * 3),
						vindex = 0,
						cindex = 0,
						pindex = 0;
				var pixels = context.getImageData(0, 0, width, height).data;
				
				
				for (var y = 0; y < height; y++) {
					for (var x = 0; x < width; x++) {	
						verts[vindex++] = (x - hWidth) * 1;
						verts[vindex++] = (hHeight - y) * 1;
						//verts[vindex++] = (x - (width / 2)) / (width / 2);
						//verts[vindex++] = ((height / 2) - y) / (height / 2);
						var distance = ((x - hWidth) / hWidth) * ((x - hWidth) / hWidth) + ((hHeight - y) / hHeight) * ((hHeight - y) / hHeight);

						var hsv = rgb2hsv(pixels[pindex], pixels[pindex + 1], pixels[pindex + 2]);
						 verts[vindex++] = (0.5 - (hsv.h / 360.0)) * 800 * 4;
						// verts[vindex++] = (0.5 - (hsv.s / 360.0)) * 800 * 4;
						//verts[vindex++] = (0.5 - (hsv.v / 360.0)) * 800;
						//verts[vindex++] = (0.5 - (pixels[pindex] / 255.0)) * 800;
						//verts[vindex++] = (0.5 - Math.random()) * 800;
						//verts[vindex++] = 0;
						
						
						colors[cindex++] = pixels[pindex++] / 255.0;
						colors[cindex++] = pixels[pindex++] / 255.0;
						colors[cindex++] = pixels[pindex++] / 255.0;
						pindex++;
					}
					numParsedPoints += width;
					progress = y / height;
				}
				parse(parser, {'ps_Vertex': verts, 'ps_Color': colors});
				
				//document.body.appendChild(canvas);
				
				end(parser);
			};
		}
	}
	
	return ImageParser;
}());