const express = require("express");
const router = express.Router();
const controller = require("../controllers/C_alumno");

// Ruta para agregar un alumno
router.post('/alumno/agregar', controller.nuevo);

// Ruta para obtener todos los alumnos
router.get('/listar', controller.listarAlumnos);

module.exports = router;
