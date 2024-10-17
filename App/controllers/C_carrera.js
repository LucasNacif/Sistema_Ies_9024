const Carrera = require("../../models/Carrera");
const Materia = require('../../models/Materia');
const mongoose = require('mongoose');

// Obtener todas las carreras
exports.obtenerCarreras = async (req, res) => {
    try {
        const carreras = await Carrera.find({});
        res.json(carreras);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener las carreras' });
    }
};

// Obtener una carrera por ID
exports.obtenerCarreraPorId = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de carrera no válido' });
    }

    try {
        const carrera = await Carrera.findById(id);
        if (!carrera) {
            return res.status(404).json({ message: 'Carrera no encontrada' });
        }
        res.json(carrera);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener la carrera' });
    }
};

// Agregar una nueva carrera
exports.agregarCarreras = async (req, res) => {
    const { nombreCarrera, titulo, cargaHoraria, duracion, planEstudio } = req.body;

    if (!nombreCarrera) {
        return res.status(400).json({ message: 'El nombre de la carrera es obligatorio' });
    }

    const nuevaCarrera = new Carrera({
        nombreCarrera,
        titulo,
        cargaHoraria,
        duracion,
        planEstudio: planEstudio || null
    });

    try {
        await nuevaCarrera.save();
        res.status(201).json({ message: 'Carrera agregada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error al agregar la carrera' });
    }
};

// Modificar una carrera
exports.modificarCarrera = async (req, res) => {
    const { id } = req.params;
    const { nombreCarrera, titulo, cargaHoraria, duracion } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de carrera no válido' });
    }

    try {
        const carrera = await Carrera.findByIdAndUpdate(
            id,
            { nombreCarrera, titulo, cargaHoraria, duracion },
            { new: true }
        );

        if (!carrera) {
            return res.status(404).json({ message: 'Carrera no encontrada' });
        }

        res.json({ message: 'Carrera modificada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al modificar la carrera' });
    }
};

// Eliminar una carrera
exports.eliminarCarreras = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de carrera no válido' });
    }

    try {
        const carrera = await Carrera.findByIdAndDelete(id);
        if (!carrera) {
            return res.status(404).json({ message: 'Carrera no encontrada' });
        }
        res.json({ message: 'Carrera eliminada correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar la carrera' });
    }
};

// PLAN DE ESTUDIO
exports.verPlanEstudio = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID de carrera no válido' });
    }

    try {
        const carrera = await Carrera.findById(id).populate({
            path: 'planEstudio',
            populate: [
                { path: 'materias' },
                { path: 'alumnos' }
            ]
        });

        if (!carrera) {
            return res.status(404).json({ message: 'Carrera no encontrada' });
        }

        res.render('Admin_PlanEstudio', {
            carrera,
            planEstudio: carrera.planEstudio
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el plan de estudio' });
    }
};

// MATERIAS
exports.agregarMateria = async (req, res) => {
    const { nombreMateria, correlativas } = req.body;

    if (!nombreMateria) {
        return res.status(400).json({ message: 'El nombre de la materia es obligatorio' });
    }

    const materia = new Materia({
        nombreMateria,
        correlativas: correlativas || []
    });

    try {
        await materia.save();
        res.status(201).json({ message: 'Materia agregada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error al agregar la materia' });
    }
};

exports.obtenerMaterias = async (req, res) => {
    try {
        const materias = await Materia.find().populate('correlativas');
        res.json(materias);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener las materias' });
    }
};


//falta modificar y eliminar materia por si alguien lo quiere hacer :)
