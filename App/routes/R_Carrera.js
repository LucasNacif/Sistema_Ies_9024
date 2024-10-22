// routes/carrera.js
const express = require('express');
const router = express.Router();
const controller = require("../controllers/C_carrera.js");
const Carrera = require('../../models/Carrera.js'); 


// CARRERA
router.get("/carrera/obtener", controller.obtenerCarreras);
router.post("/carrera/agregar", controller.agregarCarreras);
router.delete("/carrera/eliminar/:id", controller.eliminarCarreras);
router.get("/carrera/modificar/:id", controller.obtenerCarreraPorId); // Esta ruta obtiene la pagina de obtener carrera
router.put("/carrera/modificar/:id", controller.modificarCarrera); // Esta modifica una carrera


//PLAN DE ESTUDIO
router.get('/planEstudio/:id/', controller.verPlanEstudio);
//router.post('/carrera/:carreraId/agregarPlan', controller.agregarPlanEstudio); 

// MATERIA
router.post('/materia/agregar', controller.agregarMateria); 
router.get('/materia/obtener', controller.obtenerMaterias); 

// Obtener carrera por ID
router.get('/carrera/obtener/:id', async (req, res) => {
    try {
        const carrera = await Carrera.findById(req.params.id);
        if (!carrera) {
            return res.status(404).json({ message: 'Carrera no encontrada' });
        }
        console.log('Carrera obtenida:', carrera); // Agregar este log
        res.json(carrera);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la carrera' });
    }
});


module.exports = router;