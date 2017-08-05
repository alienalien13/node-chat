var express = require('express'),
	app = express(),
	logger = require('log4js').getLogger(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	port = 4000;

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

const amazingStuff = 'Its amazing stuff, '

app.get('/', function(req,res){
    res.render('pages/index', {
		title: 'main page',
		message: amazingStuff + 'bro',
		showChat: false
	});
});

app.get('/:username', function(req,res){
		res.render('pages/index', {
			title: 'Hello, ' + req.params.username,
			message: amazingStuff + req.params.username,
			showChat: true
		});
});

server.listen(port, '127.0.0.1', function(){
	var addr = server.address();
	logger.level = 'debug';
    logger.debug('listening on ' + addr.address + ':' + addr.port);
});