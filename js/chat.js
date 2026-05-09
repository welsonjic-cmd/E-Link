function openChat(name) {
    const widget = document.getElementById('chat-widget');
    const headerName = document.getElementById('chat-name');
    const avatar = document.getElementById('chat-avatar');
    const fab = document.getElementById('chat-fab');
    
    if (widget && headerName && avatar) {
        widget.style.display = 'flex';
        headerName.textContent = name;
        avatar.textContent = name.charAt(0).toUpperCase();
        if (fab) fab.style.display = 'none';
        
        const body = document.getElementById('chat-body');
        body.innerHTML = `<p class="chat-msg received">Hi! Thanks for reaching out.</p>`;
    }
}

function closeChat() {
    const widget = document.getElementById('chat-widget');
    const fab = document.getElementById('chat-fab');
    if (widget) widget.style.display = 'none';
    if (fab) fab.style.display = 'flex';
}

function sendChat() {
    const input = document.getElementById('chat-input');
    const body = document.getElementById('chat-body');
    
    if (input && input.value.trim() !== '') {
        const msg = document.createElement('p');
        msg.className = 'chat-msg sent';
        msg.textContent = input.value;
        body.appendChild(msg);
        input.value = '';
        
        body.scrollTop = body.scrollHeight;
        
        setTimeout(() => {
            const reply = document.createElement('p');
            reply.className = 'chat-msg received';
            reply.textContent = "We will get back to you shortly.";
            body.appendChild(reply);
            body.scrollTop = body.scrollHeight;
        }, 1500);
    }
}
