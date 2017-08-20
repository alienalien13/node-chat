var socket = io(),
	userLogin;
console.log(socket);

$( cosmoRotate('In') );

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

	if (insertData){
		let whoAuthor,
			mainBlock;

		//if u send message
		if (author === 'you') {
			whoAuthor = `<div class="row"><div class="col-xs-5 col-xs-offset-7"><div class="author i-am animated bounceInRight">${author}:</div></div></div>`;
			mainBlock = `<div class="row"><div class="col-xs-6 ${addedClass1}"><div class="single-message animated bounceInRight ${addedClass2}">${insertData}</div></div></div>`;
		} else { //u get message
			whoAuthor = `<div class="row"><div class="col-xs-5 author"><div class="author interlocutor animated bounceInLeft">${author}:</div></div></div>`;
			mainBlock = `<div class="row"><div class="col-xs-6 ${addedClass1}"><div class="single-message animated bounceInLeft ${addedClass2}">${insertData}</div></div></div>`;
		}
		
		//if it is NOT servise message
		if (author) return whoAuthor + mainBlock
		//it is servise message
		else return mainBlock;
	}

}
function addClientToList(client){

	let isItYou = '';

	if (client.userName === userLogin) isItYou = 'it-is-you';

	if(document.getElementById(client.id) == null) $('.clients-list').append(`<div id="${client.id}" class="row"><div class="col-xs-12"><div class="animated flash clients ${isItYou}">${client.userName}</div></div></div>`);

}
function removeClientFromList(client){
	$('#' + client.id).remove();
}
// HANDLER: client send message, client's new message display in the right side of the chat-box
function sendMessageHandler(){
	socket.emit('newMessage', $('textarea').val());
	$('.messages-box').append(singleMessage($('textarea').val(), `col-xs-offset-6`, 'you', 'mine-message'));
	$('.messages-box').scrollTop($('.messages-box').prop('scrollHeight'));
	$('textarea').focus();
}

//show ALL currently joined users in chat
socket.on('clientList', clientList => {
	for (let client in clientList){
		addClientToList(clientList[client])
	}
})

//new user join - say it to all users
socket.on('newUser', userData => {
	$('.messages-box').append(singleMessage(`Here is a new user: <b>${userData.userName}</b>`, '', '', 'new-user-notice'))
	addClientToList(userData);
})

//welcome to new user
socket.on('user', userData => {
	userLogin = userData.userName;
	$('.messages-box').append(singleMessage(`Sup, <b>${userData.userName}</b>! U are welcome!`, '', '', 'welcome-message'));
	$('.messages-box').scrollTop($('.messages-box').prop('scrollHeight'));
	$('textarea').focus();
	$('#header-user-name').show();
	$('#header-user-name').addClass('animated swing');
	$('#header-user-name').text(`Hi, ${userLogin}, how are u?`);
})

//send message by button or keyboard
$('.button.darkGrey').on('click', ()=>{
	sendMessageHandler();
	$('textarea').val('');
})
$(window).keydown(event => {
	if (event.keyCode === 13 && event.originalEvent.ctrlKey === true) {
		sendMessageHandler();
		setTimeout(() => {
			$('textarea').val('');
		}, 10)
	}
})

//client has get a new message
socket.on('shareMessage', data => {
	$('.messages-box').append(singleMessage(data.message, '', data.userName, 'gotten-message'));
})

//client has left the chat
socket.on('userDisconnected', datas => {
	$('.messages-box').append(singleMessage(`User <b>${datas.userName}</b> has been diconnected`, '', '', 'client-disconnect'))
	removeClientFromList(datas);
});

function cosmoRotate(In){
	$('.fa-grav').removeClass(`animated rotate`).removeClass(`animated rotateIn`).addClass(`animated rotate${In}`);
	setTimeout(() => {
		$('.fa-grav').removeClass(`animated rotate${In}`);
	}, 1000);
}

$('.fa-grav').on('click', () => {
	cosmoRotate('');
})