var port = 4000,
	server = '127.0.0.1',
	//socket = io.connect('http://localhost:4000'),
	socket = io(),
	chat = $('chat'),
	userLogin = new String;

	console.log(socket)

$('#joinChat').on('click', function(){

	var userName = $('#nameInp').val()
	socket.emit('newUserJoin', userName)

	location.href = socket.io.uri + '/' + userName	
	/* socket.on('connect', function(){

		console.log('OOOOOO')

		function setName(){
			var name = $('#nameInp').value
			if(name.length>0) socket.emit('setName', name);
			else setName();
		}

		setName()
	}) */

})

socket.on('setName', function(get){
	console.log(get);
})