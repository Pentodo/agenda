var express = require('express');
var router = express.Router();

var contatosController = require('../controllers/contatos');

router.get('/', contatosController.carregar, (req, res, next) => res.render('index', { title: 'Agenda' }));

module.exports = router;
