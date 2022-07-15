const messages = document.querySelectorAll('div.messages > p');
messages.forEach(message => message.addEventListener('click', () => message.remove()));
