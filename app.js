var express = require('express'),
	app = express(),
	logger = require('log4js').getLogger(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	port = 3000;

app.use(express.static(__dirname + '/page'));

app.get('/', function(req,res){
    res.sendFile(__dirname+'/page/index.html');
});

app.get('/link', function(req,res){
    res.sendFile(__dirname+'/link.html');
});

server.listen(port, '127.0.0.1', function(){
	var addr = server.address();
	logger.level = 'debug';
    logger.debug('listening on '+addr.address+':' + addr.port);
});

/* app.get('/', function(req, res){
	res.sendFile(__dirname + '/link.html')
})

app.get('/:file', function(req, res){

	var options = {
		root: __dirname + '/page/',
		dotfiles: 'allow',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	}

	res.sendFile(req.params.file, options)



}) */