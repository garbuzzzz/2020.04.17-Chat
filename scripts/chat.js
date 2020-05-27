/* Как это работает: результатом работы класса является по сути функция 
getChats, которая умеет отображать ТЕКУЩЕЕ СОСТОЯНИЕ КЛАССА, это значит 
его username, room, и все сообщения для них. Эти данные передаются при вызове
getChats в колбэк внутри нее, и все это уходит в другую часть логики, где
вызовется эта функция, и колбэк определит, что делать с этими данными. И все
это будет происходить каждый раз при изменении состояния БД */

/* Класс, который умеет:
1. добавлять сообщения (зная текст, комнату, юзера)
2. выдавать данные об имеющихся сообщениях в режиме реального времени по 
каждой комнате
3. обновлять переданного первоначально юзера
4. обновлять и показывать новую комнату в режиме реального времени */
class Chatroom {
	// принимает юзера и комнату, сообщение примется в специальном методе
	constructor(username, room) {
		this.username = username; // пусть тебя не смущает: username здесь нужен 
		// не для того, чтобы отображать только этого юзера, а для того, чтобы 
		//  когда добавлялось сообщение, знать, от кого. 
		this.room = room;
		this.chats = db.collection('chats');
		this.unsub;
	}
	// принимаем сообщение
	async addChat (message) {
		const now = new Date();
		const newDoc = {
			message,
			username: this.username,
			room: this.room,
			created_at: firebase.firestore.Timestamp.fromDate(now)
		}
		// первый вариант сделать это:
		// this.chats
		// 	.add(newDoc)
		// 	.then(() => console.log('added'))
		// 	.catch(err => console.log(err));
		// второй вариант:
		const responce = await this.chats.add(newDoc);
		// возвращать не обязательно, но сделаем это:
		return responce;
	}
	/* 
	Эта странная функция  .onSnapshot вызывается автоматически всегда;
	Также, чтобы отменить ее действие, нужно вызывать ее еще раз;
	Также, несмотря на то, что она не асинхронная (мы не отправляем данные на 
		сервер, это сам сервер при изменении в нем снимка отправляет данные нам),
		она все-таки отрабатывает с задержкой. То есть это setTimeInterval
	*/
	getChats(callback) {
		this.unsub = this.chats
			.where('room', '==', this.room)
			.orderBy('created_at')
			.onSnapshot(snapshot => {
				snapshot.docChanges().forEach(change => {
					if(change.type === 'added') callback(change);
				})
			});
	}
	// это если нужно обновить юзера
	updateUsername(newName) {
		this.username = newName;
		localStorage.setItem('username', newName);
	}
	// обновляет комнату. Причем онлайн-слушатель отменяет старую комнату, 
	// но новую не добавляет, так как новая добавится при вызове getChats
	updateRoom(newRoom) {
		this.room = newRoom;
		if(this.unsub) this.unsub();
	}
}


// const chatroom = new Chatroom('pavel', 'general');
// chatroom.getChats(change => {
// 	const when = dateFns.distanceInWordsToNow
// 	(
// 		change.doc.data().created_at.toDate(), 
// 		{ addSuffix: true }
// 	);
// 	console.log(when);
// });
