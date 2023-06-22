const express = require('express');
const timerController = require('../controllers/timer');

const router = express.Router();

router.get('/timer', timerController.timer);
router.post('/guardar-sesion', timerController.guardarNuevaSesion);
router.post('/guardar-tiempo', timerController.guardarTiempo);
router.get('/obtenTiempos', timerController.obtenTiempos);
router.post('/cambiaSesion',timerController.cambiaSesion);
router.post('/nvoPb', timerController.nvoPb);
router.post('/nvA5', timerController.nvpA5);
router.post('/nvoA12',timerController.nvpA12);

module.exports = router;