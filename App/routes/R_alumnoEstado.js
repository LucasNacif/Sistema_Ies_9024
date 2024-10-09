const express = require("express");
const router = express.Router();
const controller = require("../controllers/C_alumnoEstado");

//RUTAS PARA EL MANEJO DE ALUMNOESTADOS
router.post("/alumnoEstado/agregar", controller.crearAlumnoEstado);
router.get("/alumno/buscar/:numDocAlumn", controller.buscarAlumnoYMaterias);

// router.delete("/alumno/baja/:numDocAlumn", controller.darDeBaja);
// router.post("/alumno/modificar", controller.modificarAlumno);
// router.get('/alumno/obtenerAlumnos', controller.obtenerAlumnosActivos);

module.exports = router;
