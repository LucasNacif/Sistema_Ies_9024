const express = require('express');
const router = express.Router();
const controller = require("../controllers/C_mesa");

router.post("/mesa/crear", controller.crearMesa);

router.post("/mesa/modificar/:id", controller.modificarMesa);

router.get("/mesa", controller.obtenerMesa)

module.exports = router;