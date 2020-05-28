const chatList = document.querySelector('.chat-list');
const addForm = document.querySelector('.new-chat');
const updateForm = document.querySelector('.new-name');
const rooms = document.querySelector('.chat-rooms');
const updateName = document.querySelector('.update-mssg');

rooms.addEventListener('click', (e) => {
	if(e.target.tagName === 'BUTTON') {
		const newRoom = e.target.id;
		chatroom.updateRoom(newRoom);
		chatList.innerHTML = '';
		chatroom.getChats(change => 
			updateUI.getChatsHtml(change));
	}
});

// create instances of classes
const updateUI = new UpdateUI(chatList);
const dfltName = localStorage.getItem('username') ? localStorage.getItem('username') : 'anonymous';
const chatroom = new Chatroom(dfltName, 'general');

// the sense of the programm
chatroom.getChats(change => 
	updateUI.getChatsHtml(change));

// listeners
addForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const message = addForm.message.value.trim();
	chatroom.addChat(message)
		// .then() не знаю, принято оставлять это или нет. 
		.catch(err => console.log(err));
	addForm.reset();	
});

updateForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const newName = updateForm.name.value.trim();
	chatroom.updateUsername(newName);
	updateForm.reset();
	updateName.innerHTML = `name was updated to ${newName}`; 
	setTimeout(() => updateName.innerHTML = '', 3000);
});

