var socket = io();
//var socket = io.connect('https://cryptic-fjord-64553.herokuapp.com/')

//new user login handler
$('#joinChat').on('click', ()=>{

	var userName = $('#nameInp').val()

	if (userName.length > 0 && userName.indexOf(' ') == -1){
		socket.emit('newUserJoin', userName)
		$('#chat').attr('class', 'container chat');
		$('#helloPage').attr('class', 'no-content');
		//location.href = socket.io.uri + '/' + userName
	} else console.log('No spaces plz')
	
})

//new user join - say it to all users
socket.on('newUser', (userData)=>{
	$('.messages-box').append('<div class="row"><div class="col-xs-4 single-message new-user-notice">' + 'Here is a new user: ' + userData.userName + '</div></div>')
})

//welcome to new user
socket.on('user', (userData)=>{
	$('.messages-box').append('<div class="row"><div class="col-xs-4 single-message new-user-notice">' + 'Sup ' + userData.userName + '! U are welcome!')
})

//manage message handler
$("input[value='send']").on('click', ()=>{
	socket.emit('newMessage', $('textarea').val())
	$('.messages-box').append('<div class="row"><div class="col-xs-4 col-xs-offset-8 single-message new-user-notice">' + $('textarea').val())
})

//show new message to all
socket.on('shareMessage', (message)=>{
	$('.messages-box').append('<div class="row"><div class="col-xs-4 single-message new-user-notice">' + message)
})
