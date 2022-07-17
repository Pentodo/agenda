var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

var controller = require('../controllers/contatos');

router.get('/', controller.carregar, controller.index);

router.post('/criar', upload.single('pic'), controller.criar);

router.post('/editar', upload.single('pic'), controller.editar);

router.post('/apagar', upload.single('pic'), controller.apagar);

module.exports = router;
