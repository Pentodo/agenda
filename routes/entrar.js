var express = require('express');
var router = express.Router();

var controller = require('../controllers/entrar');

router.get('/', controller.index);

router.post('/registrar', controller.registrar);

router.post('/logar', controller.logar);

router.get('/sair', controller.sair);

router.use(controller.logSession);

module.exports = router;
