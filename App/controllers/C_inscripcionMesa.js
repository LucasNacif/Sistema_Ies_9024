const Mesa = require("../../models/Mesa");
const PlanEstudio = require("../../models/PlanEstudio");
const Alumno = require("../../models/Alumno");
const AlumnoEstado = require("../../models/AlumnoEstado");
const { docAlumLogueado } = require('../middlewares/autorizacion');


// Función para obtener mesas disponibles según el alumno y su plan de estudios
exports.obtenerMesasSegunAlum = async (req, res) => {
    try {
        // Traigo el doc del alumno logueado
        const documentoAlum = await docAlumLogueado(req, res);

        if (!documentoAlum) {
            return res.status(401).send('No hay un alumno logueado');
        }

        // Busco el alumno por su número de documento
        const alumno = await Alumno.findOne({ numDocAlumn: documentoAlum });
        if (!alumno) {
            // Si el alumno logueado aun no lo han registrado en un plan de estudio renderiza la vista vacia
            return res.render('Alumno_MesaExamen');
        }

        // Obtengo el plan de estudio del alumno
        const planEstudioDelAlumno = await PlanEstudio.findOne({ alumnos: alumno._id }).populate('materias');

        // Si hay un plan de estudio le saco las materias
        const materiasDelAlumno = planEstudioDelAlumno ? planEstudioDelAlumno.materias : [];

        if (!materiasDelAlumno.length) {
            return res.render('Alumno_MesaExamen', { mesasDisponibles: [] });
        }

        // Busco las mesas para esas materias
        const mesasDisponibles = await Mesa.find({
            Materia: { $in: materiasDelAlumno },
            estadoActual: 'activa'
        }).populate({
            path: 'Materia',
            populate: { path: 'correlativas' }
        });

        // Verificar el estado del alumno en la materia de la mesa
        const estadosAlumno = await AlumnoEstado.find({ idAlumno: alumno._id }).populate('idMateria');

        //renderizo la vista con las mesas diponibles y los estados en cada materia para que el alumno los pueda observar
        res.render('Alumno_MesaExamen', { mesasDisponibles, estadosAlumno });
    } catch (error) {
        console.error('Error al obtener las mesas según el alumno:', error);
        res.status(500).send('Error del servidor');
    }
};

// Función para verificar si un alumno tiene permiso para inscribirse a una mesa de examen
exports.verificarPermisoParaRendir = async (req, res) => {
    try {
        // Traigo el id del alumno logueado
        const docAlumno = await docAlumLogueado(req, res);
        if (!docAlumno) {
            return res.json({ success: false, mensaje: 'No hay un alumno logueado' });
        }

        const alumno = await Alumno.findOne({ numDocAlumn: docAlumno });
        if (!alumno) {
            return res.json({ success: false, mensaje: 'Aun no estas cargado en la base de datos' });
        }
        const alumnoId = alumno._id.toString();;
        // Traigo el id de la mesa
        const { mesaId } = req.params;

        // Traigo la mesa con sus materias y alumnos
        const mesa = await Mesa.findById(mesaId)
            .populate({
                path: 'Materia',
                populate: { path: 'correlativas' }
            })
            .populate('Alumno');

        if (!mesa) {
            return res.json({ success: false, mensaje: 'Mesa no encontrada' });
        }

        if (mesa.estadoActual === 'suspendida') {
            return res.json({ success: false, mensaje: "Mesa suspendida" });
        }

        // Verifico si el alumno ya está inscrito en la mesa
        const inscripcionExistente = await verificarInscripcionExistente(alumnoId, mesa.Alumno);
        if (inscripcionExistente) {
            return res.json({ success: false, mensaje: 'Ya estas inscripto en esta mesa' });
        }

        // Verificar si el alumno aprobó las correlativas
        const correlativasAprobadas = await verificarCorrelativas(alumnoId, mesa.Materia);

        if (!correlativasAprobadas) {
            return res.json({ success: false, mensaje: 'No puedes inscribirte, no has aprobado todas las correlativas' });
        }

        // Verificar el estado del alumno en la materia de la mesa
        const alumEstado = await AlumnoEstado.findOne({
            idAlumno: alumnoId,
            idMateria: mesa.Materia._id,
        });
        const resultadoVerificacion = await verificarEstadoMateriaMesa(alumEstado, alumnoId, mesa, res);
        if (resultadoVerificacion) return resultadoVerificacion;

    } catch (error) {
        console.error("Error al verificar el permiso para rendir:", error.message);
        return res.json({ success: false, mensaje: 'Error en el servidor' });
    }
};

// Función para verificar si el alumno ya está inscrito en la mesa
async function verificarInscripcionExistente(alumnoParaVerificar, alumnosExistentesEnLaMesa) {
    try {
        const alumnoYaInscripto = alumnosExistentesEnLaMesa.some(alumno => alumno._id.toString() === alumnoParaVerificar);
        return alumnoYaInscripto;
    } catch (error) {
        console.error("Error al verificar la inscripción existente:", error.message);
        throw new Error("Error al verificar la inscripción existente");
    }
}

// Función para verificar las correlativas del alumno
async function verificarCorrelativas(alumnoId, materiaParaRendir) {
    try {
        // Verifico si tiene correlativas
        if (materiaParaRendir && materiaParaRendir.correlativas && materiaParaRendir.correlativas.length > 0) {
            // Traigo los estados del alumno para todas las correlativas
            const estadoAlumnoCorrelativas = await AlumnoEstado.find({
                idAlumno: alumnoId,
                idMateria: { $in: materiaParaRendir.correlativas },
                estadoActual: { $in: ['acreditado'] } // Solo las que están aprobadas
            });

            // Devuelvo true si aprobó todas las correlativas, de lo contrario false
            return estadoAlumnoCorrelativas.length === materiaParaRendir.correlativas.length;
        }
        return true; // Si no tiene correlativas, puede rendir
    } catch (error) {
        console.error("Error al verificar las correlativas:", error.message);
        throw new Error("Error al verificar las correlativas");
    }
}

// Función para verificar el estado de la materia de la mesa para el alumno
async function verificarEstadoMateriaMesa(alumEstado, alumnoId, mesa, res) {
    try {
        if (alumEstado) {
            switch (alumEstado.estadoActual) {
                case "libre":
                case "regular":
                    mesa.Alumno.push(alumnoId);
                    await mesa.save();
                    return res.json({ success: true, mensaje: 'Inscripción realizada con éxito' });
                case "sin estado":
                    return res.json({ success: false, mensaje: 'No puede inscribirse, aun no tiene un estado registrado' });
                case "acreditado":
                    return res.json({ success: false, mensaje: 'No puede inscribirse, esta materia ya está acreditada' });
                default:
                    return res.json({ success: false, mensaje: 'Estado de la materia no válido' });
            }
        } else {
            return res.json({ success: false, mensaje: 'Aun no tienes cargado tu estado en esta materia' });
        }
    } catch (error) {
        console.error("Error al verificar el estado de la materia:", error.message);
        return res.json({ success: false, mensaje: 'Error al verificar el estado de la materia' });
    }
}
