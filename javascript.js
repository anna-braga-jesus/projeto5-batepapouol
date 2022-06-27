
const PARTICIPANTES = "https://mock-api.driven.com.br/api/v6/uol/participants";
const MENSAGENS = "https://mock-api.driven.com.br/api/v6/uol/messages";
const STATUS = "https://mock-api.driven.com.br/api/v6/uol/status";

class Conversa {
	constructor(nome){
		this.meu_name = nome;
		this.mensagens = [];
	}
	async FazerLogin(){
		var an = { name: this.meu_name }
		await axios.post(PARTICIPANTES, an)
		.then( ()=>{
			this.EntrarNaSala();
		})
	}

	EntrarNaSala(){
		document.querySelector('#login').style.display = "none";
		document.querySelector('#chat').style.display = "block";
		this.pegarMensagensDoServidor();
		this.AtualizarStatus();
	}
	pegarMensagensDoServidor(){
		setInterval(() => {
			axios.get(MENSAGENS).then((ret)=>{
				[...this.mensagens] = ret.data;
				document.querySelector('#conteudo ul').innerHTML = "";
				this.RenderizarConversasDoServidor(ret.data);
			});
		}, 3 * 1000);	
	}
	RenderizarConversasDoServidor(msgDoServidor){
		const conteudo = document.querySelector('#conteudo ul');

		for(let i = 0; i<msgDoServidor.length;i++){
			let li = document.createElement('li');
			let span = document.createElement('span');
			li.className = "retangulo1";
			switch(msgDoServidor[i].type){
				case "message":
					li.style.background = "white";
					span.innerHTML = `<font color="gray">${msgDoServidor[i].time}</font> <strong>${msgDoServidor[i].from}</strong> para <strong>${msgDoServidor[i].to}</strong>: ${msgDoServidor[i].text}`;
					break;
				case "status": 
					li.style.background = "gray";
					span.innerHTML = `<font color="white">${msgDoServidor[i].time}</font> <strong>${msgDoServidor[i].from}</strong>: ${msgDoServidor[i].text}`;
					break;
				// case "status": QUERIA QUE FOSSE RESERVADAMENTE
				// li.style.background = "pink";
				// span.innerHTML = `<font color="pink">${msgDoServidor[i].time}</font> <strong>${msgDoServidor[i].from}</strong>: ${msgDoServidor[i].text}`;
				// break;
			}
			li.appendChild(span);
			conteudo.appendChild(li);
			
		}
		this.FocarNaUltimaMensagem();
		 
		
	}
	EnviarMensagem(text, messageType){
		axios.post(MENSAGENS, {
			from: this.meu_name,
			to: "Todos",
			text: text,
			type: messageType
		})
	}
	AtualizarStatus(){
		setInterval(() => {
			axios.post(STATUS, {name: this.meu_name});
		}, 1000 * 5);
	}
	FocarNaUltimaMensagem(){
		const conteudo = document.querySelector('#conteudo ul');
		const ultimaMensagem = conteudo.lastElementChild
		ultimaMensagem.scrollIntoView()
		console.log(ultimaMensagem)
	}
}

var chat;

document.querySelector('#login #inner-login button')
	.addEventListener('click', ()=>{
		let inputName = document.querySelector('input.login').value;
		chat = new Conversa(inputName);
		chat.FazerLogin();
		
	});
document.querySelector('#button-send')
	.addEventListener('click', ()=>{
		const texto = document.querySelector('.input-texto').value
		chat.EnviarMensagem(texto, "message")
	});