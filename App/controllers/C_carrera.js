const Carrera = require("../../models/Carrera");
const Materia = require('../../models/Materia');
const PlanEstudio = require("../../models/PlanEstudio");
const mongoose = require('mongoose');

// CARRERAS
exports.obtenerCarreras = async (req, res) => {
    try {
        const carreras = await Carrera.find({estado:true});
        res.json(carreras);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener las carreras' });
    }
};
exports.obtenerCarreraPorId = async (req, res) => {
    try {
        const carrera = await Carrera.findById(req.params.id);
        if (!carrera) {
            return res.status(404).json({ message: 'Carrera no encontrada' });
        }
        return res.json(carrera);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener la carrera' });
    }
};
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
exports.bajaCarreras = async (req, res) => {
    const { id } = req.params;
    let carrera = null;

    try {
        if (id) {
            carrera = await Carrera.findOneAndUpdate(
                { _id: id },
                { estado: false },
                { new: true }
            );
        } else {
            return res.status(400).json({ message: 'ID no proporcionado' });
        }

        if (!carrera) {
            return res.status(404).json({ message: 'Carrera no encontrada' });
        }

        console.log(carrera);
        return res.json({ message: 'Carrera dada de baja correctamente' });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Error al eliminar la carrera' });
    }
};


// PLAN DE ESTUDIO
exports.verPlanEstudio = async (req, res) => {
    const { id } = req.params;

    try {
        let carrera = await obtenerPlanEstudio(id);

        if (!carrera) {
            return res.status(404).json({ message: 'Carrera no encontrada' });
        }

        // Si la carrera no tiene un plan de estudio, se crea uno vacío
        if (!carrera.planEstudio) {
            await crearPlanEstudioVacio(carrera);
            carrera = await obtenerPlanEstudio(id); // Vuelvo a buscar la carrera con el nuevo plan de estudio
        }
        
        res.render('Admin_PlanEstudio', {
            carrera,
            planEstudio: carrera.planEstudio,
            materias: carrera.planEstudio.materias || [],
            alumnos: carrera.planEstudio.alumnos || [] 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el plan de estudio' });
    }
};
const obtenerPlanEstudio = async (carreraId) => {

    return Carrera.findById(carreraId).populate({
        path: 'planEstudio',
        populate: [
            { path: 'materias',
                populate: {
                    path: 'correlativas'
                }
            },
            { path: 'alumnos' }
        ]
    });
};
const crearPlanEstudioVacio = async (carrera) => {
    const nuevoPlanEstudio = new PlanEstudio({
        carrera: carrera._id,
        materias: [],
        alumnos: []
    });
    await nuevoPlanEstudio.save();
    carrera.planEstudio = nuevoPlanEstudio._id;
    await carrera.save();
};


// MATERIAS
exports.nuevaMateriaPlanDeEstudio = async (req, res) => {
    try {
        const { nombreMateria, correlativas } = req.body;

        if (!nombreMateria) {
            return res.status(400).json({ error: "El nombre de la materia es obligatorio" });
        }

        const correlativasObjectIds = correlativas.map(correlativa => {
            return mongoose.Types.ObjectId.isValid(correlativa) ? mongoose.Types.ObjectId(correlativa) : null;
        }).filter(id => id !== null);

        const nuevaMateria = new Materia({
            nombreMateria,
            correlativas: correlativasObjectIds
        });

        await nuevaMateria.save();
        res.status(201).json({ message: "Materia creada exitosamente", materia: nuevaMateria });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear la materia" });
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
exports.eliminarMateria = async (req, res) => {
    const { id } = req.params;
    try {
        const materia = await Materia.findByIdAndDelete(id);
        if (!materia) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }
        res.json({ message: 'Materia eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la materia' });
    }
};
exports.modificarMateria = async (req, res) => {
    const { nombre, correlativas } = req.body;

    try {
        const materia = await Materia.findByIdAndUpdate(
            req.params.id,
            { nombre, correlativas },
            { new: true, runValidators: true }
        );

        if (!materia) {
            return res.status(404).json({ message: 'Materia no encontrada' });
        }

        res.json(materia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al modificar la materia' });
    }
};

