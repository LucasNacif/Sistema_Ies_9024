// routes/carrera.js
const express = require('express');
const router = express.Router();
const controller = require("../controllers/C_carrera.js");

router.get("/carrera/obtener", controller.obtenerCarreras);

router.post("/carrera/agregar", controller.agregarCarreras);

router.delete("/carrera/eliminar/:id", controller.eliminarCarreras);

router.get('/carrera/:id/planEstudio', controller.verPlanEstudio);

//router.post('/carrera/:carreraId/agregarPlan', controller.agregarPlanEstudio); 

router.post('/materia/agregar', controller.agregarMateria); 

router.get('/materia/obtener', controller.obtenerMaterias); 

module.exports = router;