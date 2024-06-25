const express = require("express");

const router = express.Router();
const controller = require("../controllers/user");

const path = "user";

//Maneja el controlador para agregar Alumnos
router.post(`/${path}/agregar`, controller.nuevo);

//Donde se maneja el form para meter alumnos

module.exports = router;
