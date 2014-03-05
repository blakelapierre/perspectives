var express = require('express'),
	app = express(),
	port = 35711;

app.use(express.static(__dirname + '/public'));

app.listen(port);

console.log('Experience new perspectives at port', port);
