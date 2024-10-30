const express = require('express');
const router = express.Router();
const controller = require("../controllers/C_mesa");

router.post("/mesa/crear", controller.crearMesa);

module.exports = router;
