const Carrera = require("../../models/Carrera");
const PlanEstudio = require('../../models/PlanEstudio');

// Obtener todas las carreras
exports.obtenerCarreras = async (req, res) => {
    try {
        const carreras = await Carrera.find({});
        console.log(carreras); 
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
        res.render('planEstudio', {
            carrera: carrera,
            tienePlan: carrera.planEstudio.length > 0 // Verifica si tiene plan de estudio
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener el plan de estudio');
    }
};
// Agregar un plan de estudio a una carrera existente
// exports.agregarPlanEstudio = async (req, res) => {
//     try {
//         const { carreraId } = req.params;
//         const { materias } = req.body;

//         // verifico si existe la carrera
//         const carrera = await Carrera.findById(carreraId);
//         if (!carrera) {
//             return res.status(404).send('Carrera no encontrada');
//         }

//         const nuevoPlanEstudio = new PlanEstudio({
//             carrera: carreraId,
//             materias: materias || [] // si no hay materias queda vacio
//         });

//         await nuevoPlanEstudio.save();

//         // Asociar el plan de estudio a la carrera
//         carrera.planEstudio.push(nuevoPlanEstudio._id);
//         await carrera.save(); // Actualizar la carrera

//         res.status(200).send('Plan de estudio agregado correctamente');
//     } catch (error) {
//         console.log(error);
//         res.status(400).send('Error al agregar el plan de estudio');
//     }
// };
