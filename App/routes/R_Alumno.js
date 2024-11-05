const express = require("express");
const router = express.Router();
const controller = require("../controllers/C_alumno");

//RUTAS PARA EL MANEJO DE ALUMNOS POR PARTE DEL ADMIN:

router.post("/alumno/agregarAlumnoPlanEstudio", controller.nuevoAlumnoPlanDeEstudio);
router.put("/alumno/estado", controller.modificarEstado);
router.post("/alumno/modificar/:id", controller.modificarAlumno);

module.exports = router;
