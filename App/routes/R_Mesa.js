const express = require('express');
const router = express.Router();
const controller = require("../controllers/C_mesa");

router.post("/mesa/crear", controller.crearMesa);
router.put("/mesa/modificar/:id", controller.modificarMesa);
router.put("/mesa/darDeBaja/:id", controller.darDeBajaMesa);
router.get("/mesa/mostrar/Suspendidas", controller.mostrarMesasSuspendidas);
router.get("/mesa", controller.obtenerMesa)

module.exports = router;
