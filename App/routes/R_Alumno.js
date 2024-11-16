const express = require("express");
const router = express.Router();
const controller = require("../controllers/C_alumno");

router.post("/alumno/agregarAlumnoPlanEstudio", controller.nuevoAlumnoPlanDeEstudio);

router.put("/alumno/estado", controller.modificarEstado);

router.put("/alumno/modificar", controller.modificarAlumno);

module.exports = router;
