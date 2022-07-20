const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', event => {
        const email = form.querySelector('[name=email]');

        const errors = [];
        errors.push(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value) ? false : 'E-mail inválido!');

        if (errors.filter(error => error).length > 0) {
            let messageDiv = document.querySelector('.messages');

            if (!messageDiv) {
                messageDiv = document.createElement('div');
                messageDiv.classList.add('messages');

                document.body.append(messageDiv);
            }

            errors.map(error => {
                let exist;
                document.querySelectorAll('.messages > p').forEach(message => {
                    if (message.innerHTML = error) {
                        exist = message;
                    }
                });

                if (!exist) {
                    const message = document.createElement('p');

                    message.innerHTML = error;
                    message.addEventListener('click', () => message.remove());

                    messageDiv.append(message);
                }
                else {
                    exist.style.backgroundColor = "#" + ((1 << 24) * Math.random() | 0).toString(16);
                }
            });

            email.focus();
            event.preventDefault();
        }
    });
});
