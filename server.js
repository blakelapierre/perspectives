var fs = require('fs'),
	path = require('path'),
	express = require('express'),
	app = express(),
	port = 35711;

var publicDir = path.join(__dirname, 'public'),
	imagesDir = path.join(publicDir, 'images');

app.use(express.static(publicDir));

app.get('/imageList', function(req, res) {
	fs.readdir(imagesDir, function(err, files) {
		if (err) throw err;

		res.json({files: files});
	});
});

app.listen(port);

console.log('Experience new perspectives at port', port);
