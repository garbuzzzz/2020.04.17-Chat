class UpdateUI {
	constructor(list){
		this.list = list;
	}
	getChatsHtml(data) {
		const when = dateFns.distanceInWordsToNow
		(
			data.doc.data().created_at.toDate(), 
			{ addSuffix: true }
		);
		const html = `
			<li class="list-group-item">
				<span class="username">${data.doc.data().username}</span>
				<span class="message">${data.doc.data().message}</span>
				<div class="time">${when}</div>
			</li>
		`;
		this.list.innerHTML += html;
	}
}