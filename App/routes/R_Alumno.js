const express = require("express");
const router = express.Router();
const controller = require("../controllers/C_alumno");

router.post("/alumno/agregar", controller.agregar);

router.get("/alumno/listar", controller.listarAlumnos);

router.put("/alumno/numDocAlumno/:numDocAlumn", controller.modificarAlumno);

router.get("/alumno/traerAlumno/:numDocAlumn", controller.traerUnAlumno);

router.put("/alumno/eliminar/:numDocAlumn", controller.eliminarAlumno);

router.get("/alumno/mesas", (req, res) => res.render("mesas"));

module.exports = router;
