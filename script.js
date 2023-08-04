import API_KEY from "./config.js";

const chatBtn = document.querySelector('#chat_btn');
const chatPanel = document.querySelector('#chat_panel');
const sendBtn = document.querySelector('#send_btn');
const chatText = document.querySelector('#chat_text_content');
const chatArea = document.querySelector('#chat_area');

let chatToggle = false;
let chatStr;

chatBtn.addEventListener('click', ()=>{

    chatBtn.classList.remove('hover');


    chatToggle = !chatToggle;
    if (chatToggle){
        chatPanel.style.display ="unset";
        chatBtn.innerHTML = `<span class="material-symbols-outlined">close</span>`;
        chatBtn.classList.add('chat_btn_mobile');
        
    } else{
        chatPanel.style.display ="none";
        chatBtn.innerHTML = `<span class="material-symbols-outlined">chat</span>`;
        chatBtn.classList.remove('chat_btn_mobile');
    }
})

function addNewChatBox(text, type){
    let chatBox = document.createElement('div');
    chatBox.classList.add('chat_wrapper', `${type? type:""}`);
    chatBox.innerHTML = (type == "outgoing")? `<p class="chat">${text}</p>` : `<span class="material-symbols-outlined">smart_toy</span>
    <p class="chat incoming">${text}</p>`;
    chatArea.appendChild(chatBox);
}

function addPreloader(){
    let chatBox = document.createElement('div');
    chatBox.id = "preloader"
    chatBox.classList.add('chat_wrapper');
    chatBox.innerHTML = `<span class="material-symbols-outlined">smart_toy</span>
    <p class="chat incoming loader">
    <div class="preloader"></div>
    <div class="preloader"></div>
    <div class="preloader"></div>
    </p>`;
    chatArea.appendChild(chatBox);
    chatArea.scrollTo(0, chatArea.scrollHeight);
}

function getResponse() {
    const API_URL = "https://api.openai.com/v1/chat/completions";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}` 
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "system", content: "You are an assistant that understands and speaks in Nigerian pidgin english and uses nigerian slangs"}, {role: "user", content: chatStr}]
        })
    }

    fetch(API_URL, requestOptions).then(r => r.json()).then(data =>{
        console.log(data);
        addNewChatBox(data.choices[0].message.content, "incoming");
        document.querySelector('#preloader').remove();
    }).catch((err)=>{
        console.log(err);
        addNewChatBox("Omo!, this network is not networking. Try again later.", "incoming");
    }).finally(()=> chatArea.scrollTo(0, chatArea.scrollHeight));
}

sendBtn.addEventListener('click', ()=>{
    chatStr = chatText.value.trim();

    if(!chatStr) return;

    addNewChatBox(chatStr, "outgoing");

    chatText.value = "";

    addPreloader();

    getResponse();
})

chatText.addEventListener('keyup', (e)=>{
    if(e.key == "Enter")
        sendBtn.click();
})