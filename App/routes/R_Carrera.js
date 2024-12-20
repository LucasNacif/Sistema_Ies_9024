// routes/carrera.js
const express = require('express');
const router = express.Router();
const controller = require("../controllers/C_carrera.js");

//Middlewares
const { verificarSesion, verificarRol } = require('../middlewares/autorizacion.js');

// CARRERA
router.get("/carrera/obtener", controller.obtenerCarreras);

router.get("/carrera/obtener/:id", controller.obtenerCarreraPorId);

router.post("/carrera/agregar", controller.agregarCarreras);

router.put("/carrera/baja/:id", controller.bajaCarreras);

router.get("/carrera/modificar/:id", controller.obtenerCarreraPorId); 

router.put("/carrera/modificar/:id", controller.modificarCarrera);


//PLAN DE ESTUDIO
router.get('/planEstudio/:id/',  verificarSesion, verificarRol(['bedel', 'superAdmin']), controller.verPlanEstudio);


// MATERIA
router.post('/materia/nuevaMateriaPlanDeEstudio', controller.nuevaMateriaPlanDeEstudio);

router.delete('/materia/eliminar', controller.eliminarMateria);

router.post('/materia/modificar', controller.modificarMateria);


module.exports = router;