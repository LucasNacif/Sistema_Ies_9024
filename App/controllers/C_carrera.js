const Carrera = require("../../models/Carrera");
const Materia = require('../../models/Materia');
const PlanEstudio = require("../../models/PlanEstudio");
const mongoose = require('mongoose');

// CARRERAS
exports.obtenerCarreras = async (req, res) => {
    try {
        const carreras = await Carrera.find({ estado: true });
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
            planEstudioId: carrera.planEstudio._id, 
            carreraId: carrera._id 
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el plan de estudio' });
    }
};
const obtenerPlanEstudio = async (carreraId) => {
    const carrera = await Carrera.findById(carreraId).populate({
        path: 'planEstudio',
        populate: [
            {
                path: 'materias',
                populate: {
                    path: 'correlativas'
                }
            },
            { path: 'alumnos' }
        ]
    });
    return carrera;
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
        const { nombreMateria, correlativas, idCarrera, idPlanEstudioSeleccionado } = req.body;

        if (!nombreMateria) {
            return res.status(400).json({ error: "El nombre de la materia es obligatorio" });
        }
        const nuevaMateria = new Materia({
            nombreMateria,
            correlativas
        });
   
        const planEstudio = await PlanEstudio.findById(idPlanEstudioSeleccionado);
    
        if (!planEstudio) {
            return res.status(404).json({ error: "Plan de estudio no encontrado" });
        }

        const materiaGuardada = await nuevaMateria.save();

        await planEstudio.updateOne(
            { $push: { materias: materiaGuardada._id } }
        );

        return res.redirect(`/planEstudio/${idCarrera}?success=Materia creada exitosamente`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear la materia" });
    }
};
exports.eliminarMateria = async (req, res) => {
    const { idMateria, idPlanEstudio } = req.body;

    try {
        const materia = await Materia.findByIdAndDelete(idMateria);
        if (!materia) {
            return res.status(404).json({ success: false, message: "No se encontró la materia" });
        }

        // Eliminar la materia del plan de estudio
        const planEstudio = await PlanEstudio.findByIdAndUpdate(
            idPlanEstudio,
            { $pull: { materias: idMateria } },
            { new: true }
        );

        if (!planEstudio) {
            return res.status(404).json({ success: false, message: "No se encontró el plan de estudio" });
        }
        return res.status(200).json({ success: true, message: "Materia eliminada del plan de estudio" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Error en el servidor" });
    }
};
exports.modificarMateria = async (req, res) => {
    const { idMateria, nombreMateria, nuevaCorrelativa } = req.body;
    try {
       
        const materia = await Materia.findByIdAndUpdate(
            idMateria,
            {
                $set: { nombreMateria },
                $addToSet: { correlativas: nuevaCorrelativa }
            },
            { new: true }
        );
        if (!materia) {
            return res.status(404).json({ success: false, message: "No se encontró la materia" });
        }
        return res.status(200).json({ success: true, message: "Materia modificada correctamente", materia });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: "Error en el servidor" });
    }
};

