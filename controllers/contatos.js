var fs = require('fs/promises');
var path = require('path');

var Contato = require('../models/contato');

const controller = {};

controller.index = (req, res, next) => res.render('contatos', { title: 'Contatos' });

controller.criar = async function (req, res, next) {
    const contact = new Contato(req.body, req.file, req.session);

    await contact.create();
    await req.flash('messages', contact?.errors || 'Contato cadastrado!');

    res.redirect('back');
}

controller.carregar = function (req, res, next) {
    Contato.load(req.session.email).then(contacts => {
        res.locals.contacts = contacts;
        next();
    });
}

controller.editar = function (req, res, next) {
    const contact = new Contato(req.body, req.file, req.session);

    contact.update().then(model => req.flash('messages', `Contato editado!`).then(() => res.redirect('back')));
}

controller.apagar = async function (req, res, next) {
    const contact = new Contato(req.body, req.file, req.session);

    contact.delete().then(model => req.flash('messages', `O contato de ${model.email} foi apagado!`).then(() => res.redirect('back')));
}

module.exports = controller;
