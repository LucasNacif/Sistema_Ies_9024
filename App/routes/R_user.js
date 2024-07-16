const express = require("express");
const router = express.Router();
const controller = require("../controllers/C_user");
const path = "user";

//Maneja el controlador para agregar Alumnos
router.post(`/${path}/agregar`, controller.nuevo);

//Maneja el controlador para obtener todos los Alumnos
router.get(`/${path}/listar`, controller.obtenerAlumnosTxt);





module.exports = router;
