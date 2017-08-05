console.log($('#nameInp'))

var port = 4000,
	server = '127.0.0.1',
	socket = io.connect(server + ':' + port),
	chat = $('chat'),
	userLogin = new String;

console.log(socket)
