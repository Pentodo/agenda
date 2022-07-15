const contacts = document.querySelectorAll('.contact');
contacts.forEach(contact => {
    contact.addEventListener('click', function () {
        const form = document.querySelector('form');
        const title = form.querySelector('h3');
        const inputs = form.querySelectorAll('input')
        const buttonDiv = form.querySelector('.buttons');

        const email = inputs[inputs.length - 1];

        const edit = 'contact-edit';
        const pastEdit = contact.parentNode.querySelector('.contact-edit');

        if (contact.classList.contains(edit)) {
            contact.classList.remove(edit);

            form.action = '/contatos/criar';
            title.innerHTML = 'Novo contato';
            inputs.forEach(input => input.value = '');
            email.readOnly = false;
            email.style.color = 'white';
            buttonDiv.lastElementChild.innerHTML = 'Criar';
            buttonDiv.firstElementChild.remove();
        }
        else {
            contact.classList.add(edit);
            contact.querySelectorAll('.content p').forEach((p, index) => inputs[index + 1].value = p.innerHTML);

            if (pastEdit) {
                pastEdit.classList.remove(edit);
            }
            else {
                const erase = document.createElement('button');
                erase.type = 'submit';
                erase.formAction = '/contatos/apagar';
                erase.innerHTML = 'Apagar';

                form.action = '/contatos/editar';
                title.innerHTML = 'Atualizar contato';
                email.readOnly = true;
                email.style.color = 'grey';
                buttonDiv.lastElementChild.innerHTML = 'Editar';
                buttonDiv.prepend(erase);
            }
        }
    });
});
