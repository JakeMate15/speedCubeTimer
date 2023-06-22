const express = require('express');
const estController = require('../controllers/est');

const router = express.Router();

router.get('/estadisticas', estController.estadisticas);
router.get('/acerca', estController.acerdaDE);
router.get('/tiempos', estController.tiempos);

module.exports = router;