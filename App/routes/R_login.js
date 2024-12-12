const express = require('express');
const router = express.Router();
const autentificador = require('../controllers/autenticacion');

router.post('/index/login', autentificador.login);

router.post('/index/registrar', autentificador.registrar);

router.get('/logout', autentificador.exit);

module.exports = router;
