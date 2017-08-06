var express = require('express'),
	app = express(),
	logger = require('log4js').getLogger(),
	server = require('https').Server(app),
	io = require('socket.io')(server),
	pug = require('pug'),
	port = 4000;

/* server.listen(port, '127.0.0.1', ()=>{
	var addr = server.address();
	logger.level = 'debug';
    logger.debug('listening on ' + addr.address + ':' + addr.port);
}); */
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/socket.io.js', (req,res)=>{
    res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});
app.get('/socket.io/socket.io.js', (req,res)=>{
    res.sendFile(__dirname + '/node_modules/socket.io-client/dist/socket.io.js');
});
app.get('/jquery.js', (req,res)=>{
    res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.min.js');
});
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

const amazingStuff = 'Its amazing stuff, ',
	date = new Date;

app.get('/', (req,res)=>{
    res.render('pages/index', {
		title: 'main page',
		message: date,
		showChat: false
	});
});

/* app.get('/:username', function(req,res){
	res.render('pages/index', {
		title: 'Hello, ' + req.params.username,
		message: amazingStuff + req.params.username,
		showChat: true
	});
});*/

io.on('connection', (socket)=>{

	socket.on('newUserJoin', (userName)=>{
	
		//if(userName !== undefined && userName !== ''){

		socket.session = {};
		socket.session.userName = userName;
		socket.session.address = socket.handshake.address;
		socket.session.id = socket.id;

		socket.broadcast.emit('newUser', socket.session);
		socket.emit('user', socket.session)
		socket.emit('userLisr', io.length)

		logger.info('user ' + socket.session.userName + ' / ip ' + socket.session.address)
		logger.info('user count: ' + io.engine.clientsCount)
		logger.debug(socket.session)

		var clients = io.sockets.connected,
			clientList = {};
		
		for (var i in clients){
			if(clients[i].session) clientList[i] = clients[i].session;
		}
		
		socket.emit('clientList', clientList);

	})

	//get a new message and share it to all users
	socket.on('newMessage', (message)=>{
		socket.broadcast.emit('shareMessage', message)
	})

})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});