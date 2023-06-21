const express = require('express');
const timerController = require('../controllers/timer');

const router = express.Router();

router.get('/timer', timerController.timer);
router.get('/estadisticas', timerController.estadisticas);
router.post('/guardar-sesion', timerController.guardarNuevaSesion);
router.post('/guardar-tiempo', timerController.guardarTiempo);
router.get('/obtenTiempos', timerController.obtenTiempos);


module.exports = router;