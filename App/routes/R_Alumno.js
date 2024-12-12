const express = require("express");
const router = express.Router();
const controller = require("../controllers/C_alumno");

//no hay get de alumnos porque los traemos junto con el plan de estudio en /planEstudio/:id/

router.post("/alumno/agregarAlumnoPlanEstudio", controller.nuevoAlumnoPlanDeEstudio);

router.put("/alumno/estado", controller.modificarEstado);

router.put("/alumno/modificar", controller.modificarAlumno);

module.exports = router;
