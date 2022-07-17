var Usuario = require('../models/usuario');

const controller = {};

controller.index = (req, res, next) => res.render('entrar', { title: 'Entrar' });

controller.registrar = function (req, res, next) {
    const user = new Usuario(req.body);

    user.register().then(() => {
        req.user = user;
        next();
    });
}

controller.logar = function (req, res, next) {
    const user = new Usuario(req.body);

    user.loginCheck().then(() => {
        req.user = user;
        next();
    });
}

controller.sair = async function (req, res, next) {
    delete req.session.email;
    await req.flash('messages', !req.session.email ? 'Você saiu!' : 'Não foi possível sair!');

    next();
}

controller.logSession = async function (req, res, next) {
    if (req.user) {
        if (!req.user.errors.length) {
            req.session.email = req.user.body.email;
            await req.flash('messages', 'Você entrou!');
        }
        else {
            await Promise.all(req.user.errors.map(error => req.flash('messages', error)));
        }
    }

    req.session.save(() => res.redirect(req.user && req.user.errors.length ? 'back' : '/'));
}

module.exports = controller;
