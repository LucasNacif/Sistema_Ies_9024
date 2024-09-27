const Carrera = require("../../models/Carrera");
const Materia = require('../../models/Materia');

// Obtener todas las carreras
exports.obtenerCarreras = async (req, res) => {
    try {
        const carreras = await Carrera.find({});
        res.json(carreras);
    } catch (err) {
        res.status(500).send('Error al obtener las carreras');
    }
};
// Agregar una nueva carrera
exports.agregarCarreras = async (req, res) => {
    try {
        const {
            nombreCarrera,
            titulo,
            cargaHoraria,
            duracion,
        } = req.body;

        if (!nombreCarrera) {
            return res.status(400).send('El nombre de la carrera es obligatorio');
        }

        const nuevaCarrera = new Carrera({
            nombreCarrera,
            titulo,
            cargaHoraria,
            duracion,
            planEstudio: [] ,
            alumnos: []
        });

        await nuevaCarrera.save();
        res.status(201).send('Carrera agregada correctamente');
    } catch (error) {
        console.log(error);
        res.status(400).send('Error al agregar la carrera');
    }
};


// Eliminar una carrera
exports.eliminarCarreras = async (req, res) => {
    try {
        await Carrera.findByIdAndDelete(req.params.id);
        res.send('Carrera eliminada correctamente');
    } catch (err) {
        res.status(500).send('Error al eliminar la carrera');
    }
};


// Ver plan de estudio de una carrera
exports.verPlanEstudio = async (req, res) => {
    try {
        const carreraId = req.params.id;
        const carrera = await Carrera.findById(carreraId).populate('planEstudio'); // Asegúrate de tener la relación en el modelo

        if (!carrera) {
            return res.status(404).send('Carrera no encontrada');
        }

        // Renderiza la vista con la información de la carrera
        res.render('PlanEstudio_Admin', {
            carrera: carrera,
            tienePlan: carrera.planEstudio.length > 0 // Verifica si tiene plan de estudio
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener el plan de estudio');
    }
};
// Agregar un plan de estudio a una carrera existente
exports.agregarPlanEstudio = async (req, res) => {
    try {
        const { carreraId } = req.params;
        const { materias } = req.body;

        // Verifico si existe la carrera
        const carrera = await Carrera.findById(carreraId);
        if (!carrera) {
            return res.status(404).send('Carrera no encontrada');
        }

        const nuevoPlanEstudio = {
            materias: materias || [] // Si no hay materias queda vacío
        };

        // Asociar el nuevo plan de estudio a la carrera
        carrera.plan.push(nuevoPlanEstudio);
        await carrera.save(); // Actualizar la carrera

        res.status(200).send('Plan de estudio agregado correctamente');
    } catch (error) {
        console.log(error);
        res.status(400).send('Error al agregar el plan de estudio');
    }
};


exports.agregarMateria = async (req, res) => {
    try {
        const { nombreMateria, correlativas } = req.body;

        if (!nombreMateria) {
            return res.status(400).send('El nombre de la materia es obligatorio');
        }

        const materia = new Materia({
            nombreMateria: nombreMateria,
            correlativas: correlativas || []
        });
        console.log(materia);
        await materia.save();
        res.status(201).send('Materia agregada correctamente');
    } catch (error) {
        console.log(error);
        res.status(400).send('Error al agregar la materia');
    }
};

// Obtener todas las materias
exports.obtenerMaterias = async (req, res) => {
    try {
        const materia = await Materia.find().populate('correlativas');
        // console.log(materia); 
        res.json(materia);
    } catch (err) {
        res.status(500).send('Error al obtener las materias');
    }
};