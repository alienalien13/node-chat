var socket = io();
console.log(socket);

//new user login handler
$('#joinChat').on('click', () => {

	var userName = $('#nameInp').val()

	if (userName.length > 0 && userName.indexOf(' ') == -1){
		socket.emit('newUserJoin', userName);
		$('#chat').attr('class', 'container chat');
		$('#helloPage').attr('class', 'no-content');
		//location.href = socket.io.uri + '/' + userName
	} else console.log('No spaces plz');
	
})



function singleMessage(insertData, addedClass1, author, addedClass2){

	let whoAuthor,
		mainBlock = `<div class="row"><div class="col-xs-5 ${addedClass1}"><div class="single-message animated bounceInLeft ${addedClass2}">${insertData}</div></div></div>`;

	if (author === 'you') {
		whoAuthor = `<div class="row"><div class="col-xs-5 col-xs-offset-7"><div class="author i-am animated bounceInRight">${author}:</div></div></div>`;
		mainBlock = `<div class="row"><div class="col-xs-5 ${addedClass1}"><div class="single-message animated bounceInRight ${addedClass2}">${insertData}</div></div></div>`;
	} else {
		whoAuthor = `<div class="row"><div class="col-xs-5 author"><div class="author interlocutor animated bounceInLeft">${author}:</div></div></div>`;
		mainBlock = `<div class="row"><div class="col-xs-5 ${addedClass1}"><div class="single-message animated bounceInLeft ${addedClass2}">${insertData}</div></div></div>`;
	}
	
	if (author !== '' && author !== undefined && author !== null) return whoAuthor + mainBlock
		else return mainBlock;
}
function addClientToList(client){

	if(document.getElementById(client.id) == null) $('.clients-list').append(`<div id="${client.id}" class="row"><div class="col-xs-10 col-xs-offset-1"><div class="animated flash">${client.userName}</div></div></div>`);

}
function removeClientFromList(client){

	$('#' + client.id).remove();

}



socket.on('clientList', clientList => {
	for (let client in clientList){
		addClientToList(clientList[client])
	}
})





//new user join - say it to all users
socket.on('newUser', userData => {
	$('.messages-box').append(singleMessage(`Here is a new user: ${userData.userName}`, '', '', 'new-user-notice'))
	addClientToList(userData);
})

//welcome to new user
socket.on('user', userData => {
	$('.messages-box').append(singleMessage(`Sup, ${userData.userName}! U are welcome!`, '', '', 'welcome-message'));
	$('.messages-box').scrollTop($('.messages-box').prop('scrollHeight'));
})


//client send message, client's new message display in the right side of the chat-box
$("input[value='SEND']").on('click', ()=>{
	socket.emit('newMessage', $('textarea').val());
	$('.messages-box').append(singleMessage($('textarea').val(), `col-xs-offset-7`, 'you', 'mine-message'));
	$('.messages-box').scrollTop($('.messages-box').prop('scrollHeight'));
})

//client has get a new message
socket.on('shareMessage', data => {
	$('.messages-box').append(singleMessage(data.message, '', data.userName, 'gotten-message'));
})


socket.on('userDisconnected', datas => {
	removeClientFromList(datas);
})