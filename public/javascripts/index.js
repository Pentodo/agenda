const messages = document.querySelectorAll('.messages > p');
messages.forEach(message => message.addEventListener('click', () => message.remove()));
