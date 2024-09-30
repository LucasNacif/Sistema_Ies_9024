// routes/carrera.js
const express = require('express');
const router = express.Router();
const controller = require("../controllers/C_carrera.js");

// CARRERA
router.get("/carrera/obtener", controller.obtenerCarreras);
router.post("/carrera/agregar", controller.agregarCarreras);
router.delete("/carrera/eliminar/:id", controller.eliminarCarreras);
router.get('/carrera/:id/planEstudio', controller.verPlanEstudio);
//router.post('/carrera/:carreraId/agregarPlan', controller.agregarPlanEstudio); 

// MATERIA
router.post('/materia/agregar', controller.agregarMateria); 
router.get('/materia/obtener', controller.obtenerMaterias); 

// MESA


module.exports = router;