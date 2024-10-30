const express = require("express");
const router = express.Router();
const controller = require("../controllers/C_alumnoEstado");

//RUTAS PARA EL MANEJO DE ALUMNOESTADOS
router.post("/alumnoEstado/agregar", controller.crearAlumnoEstado);
router.get("/alumno/buscar/:numDocAlumn", controller.buscarAlumnoYMaterias);
//router.put('/alumnoEstado/actualizar/:idAlumnoEstado', controller.actualizarEstadoAlumno);
router.delete(`/alumnoEstado/eliminar/:id`, controller.eliminarEstadoAlumno);


module.exports = router;

