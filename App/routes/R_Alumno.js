const express = require("express");
const router = express.Router();
const controller = require("../controllers/C_alumno");

router.post("/alumno/agregar", controller.nuevo);

router.get("/alumno/listar", controller.listarAlumnos);

router.get("/alumno/mesas", (req, res) => res.render("mesas"));

router.get("/alumno/numDocAlumno/:numDocAlumn", controller.conseguirAlumno);

module.exports = router;
