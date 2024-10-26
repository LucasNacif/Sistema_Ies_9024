// routes/carrera.js
const express = require('express');
const router = express.Router();
const controller = require("../controllers/C_carrera.js");
const Carrera = require('../../models/Carrera.js'); 


// CARRERA
router.get("/carrera/obtener", controller.obtenerCarreras);
router.post("/carrera/agregar", controller.agregarCarreras);
router.delete("/carrera/baja/:id", controller.bajaCarreras);
router.get("/carrera/modificar/:id", controller.obtenerCarreraPorId); 
router.put("/carrera/modificar/:id", controller.modificarCarrera);


//PLAN DE ESTUDIO
router.get('/planEstudio/:id/', controller.verPlanEstudio);

//router.post('/carrera/:carreraId/agregarPlan', controller.agregarPlanEstudio); 

// MATERIA
router.post('/materia/nuevaMateriaPlanDeEstudio', controller.nuevaMateriaPlanDeEstudio); 
router.get('/materia/obtener', controller.obtenerMaterias);     
router.delete('/materia/eliminar/:id', controller.eliminarMateria);
router.delete('/materia/modificar/:id', controller.modificarMateria);


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