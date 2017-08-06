var port = 4000,
	server = '127.0.0.1',
	socket = io();

$('#joinChat').on('click', ()=>{

	var userName = $('#nameInp').val()

	if (userName.length > 0 && userName.indexOf(' ') == -1){
		socket.emit('newUserJoin', userName)
		$('#chat').attr('class', 'container chat');
		$('#helloPage').attr('class', 'no-content');
		//location.href = socket.io.uri + '/' + userName
	} else console.log('No spaces plz')
	
})

socket.on('newUser', (userData)=>{
	$('.messages-box').append('<div class="row"><div class="col-xs-4 single-message new-user-notice">' + 'Here is a new user: ' + userData.userName + '</div></div>')
})
socket.on('user', (userData)=>{
	$('.messages-box').append('<div class="row"><div class="col-xs-4 single-message new-user-notice">' + 'Hello, ' + userData.userName + '! Welcome!')
})


/* window.onload = function(){
	socket.on('user', function(get){
		console.log(get)
		console.log(document.getElementById('clients'))
	})
} */