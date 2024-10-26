const express = require("express");
const router = express.Router();
const controller = require("../controllers/C_alumno");

//RUTAS PARA EL MANEJO DE ALUMNOS POR PARTE DEL ADMIN:
//router.post("/alumno/agregar", controller.nuevo);

//a esta ruta se le manda todos los datos del alumno para guardar y el id del plan de estudio donde se los quiere guradar
router.post("/alumno/agregarAlumnoPlanEstudio", controller.nuevoAlumnoPlanDeEstudio);

router.get("/alumno/traerPorDoc/:numDocAlumn", controller.traerPorDoc);
router.delete("/alumno/baja/:numDocAlumn", controller.darDeBaja);
router.post("/alumno/modificar/:id", controller.modificarAlumno);
router.get('/alumno/obtener', controller.obtenerAlumnosActivos);

module.exports = router;
