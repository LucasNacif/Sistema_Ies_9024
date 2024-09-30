const express = require("express");
const router = express.Router();
const controller = require("../controllers/C_alumno");


//RUTAS PARA EL MANEJO DE ALUMNOS POR PARTE DEL ADMIN:
router.post("/alumno/agregar", controller.nuevo);
router.get("/alumno/traerPorDoc/:numDocAlumn", controller.traerPorDoc);
router.delete("/alumno/baja/:numDocAlumn", controller.darDeBaja);
router.post("/alumno/modificar", controller.modificarAlumno);
router.get('/alumno/obtenerAlumnos', controller.obtenerAlumnosActivos);

//RUTAS PARA ALUMNOS LOGUEADOS
router.get("/alumnoLog/verificarPermisoParaRendir/:numDocAlumn", controller.obtenerMesas)
router.get('/alumno/:alumnoId/mesa/:mesaId/disponibles', controller.verificarPermisoParaRendir);


module.exports = router;
