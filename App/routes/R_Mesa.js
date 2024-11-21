const express = require('express');
const router = express.Router();
const controller = require("../controllers/C_mesa");
//Middlewares
const { verificarSesion, verificarRol } = require('../middlewares/autorizacion');

router.post("/mesa/crear", controller.crearMesa);

router.post("/mesa/modificar/:id", controller.modificarMesa);

router.get("/mesa", verificarSesion, verificarRol(['bedel', 'superAdmin']), controller.obtenerMesa)

module.exports = router;