var express = require('express'),
	app = express(),
	logger = require('log4js').getLogger(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
	pug = require('pug'),
	port = 4000;

server.listen(port, '127.0.0.1', function(){
	var addr = server.address();
	logger.level = 'debug';
    logger.debug('listening on ' + addr.address + ':' + addr.port);
});

app.use(express.static(__dirname + '/public'));

app.get('/socket.io.js', function(req,res){
    res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});
app.get('/jquery.js', function(req,res){
    res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.min.js');
});
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

const amazingStuff = 'Its amazing stuff, ';

//app.use(express.static(__dirname + '/views/index.pug'));
//app.enable('view cache')

/* app.get('/', function(req, res) {
	res.render('pages/index.pug');
}); */

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

io.on('connection', function(socket){

	socket.on('newUserJoin', function(userName){
	
		if(userName !== undefined && userName !== ''){

			socket.session = {};
			socket.session.userName = userName;
			socket.session.address = socket.handshake.address;
			socket.session.id = socket.id;

			socket.broadcast.emit('newUser', socket.session);
			socket.emit('userName', socket.session)
			socket.emit('userLisr', io.length) //whated to send not amount, but all names

			logger.info('user ' + socket.session.userName + '; ip ' + socket.session.address)
			logger.info('user count: ' + io.engine.clientsCount)

			var clients = io.sockets.connected,
				clientList = {};
			
			for (var i in clients){
				if(clients[i].session) clientList[i] = clients[i].session;
			}
			
			socket.emit('clientList', clientList);
			socket.emit('setName', socket.session);
		} else {
			socket.emit('setName', 'empty');
			logger.warn('empty')
		}

	})
})

