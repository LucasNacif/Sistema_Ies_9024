const express = require("express");
const router = express.Router();
const controller = require("../controllers/C.materias");

router.post("/materia/agregar", controller.agregarMateria);

router.get("/materia/listar", controller.listarMaterias);

router.put(
  "/materia/nombreMateria/:nombreMateria",
  controller.modificarMateria
);

router.delete("/materia/eliminar/:nombreMateria", controller.eliminarMateria);

module.exports = router;
