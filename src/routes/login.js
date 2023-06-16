const express = require('express');
const LoginController = require('../controllers/login');
const login = require('../controllers/login');

const router = express.Router();

router.get('/login', login.login);
router.post('/login', login.iniciarSesion);
router.get('/registro', login.registro);
router.post('/registro', login.alta);
router.get('/logout',LoginController.cerrarSesion);


module.exports = router;