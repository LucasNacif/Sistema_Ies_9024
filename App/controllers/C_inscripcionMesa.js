const Mesa = require("../../models/Mesa");
const AlumnoEstado = require("../../models/AlumnoEstado");
const { IdAlumLogueado } = require('../middlewares/autorizacion');

exports.obtenerMesasActivas = async (req, res) => {
    try {
        const mesasDisponiles = await Mesa.find({ estadoActual: 'activa' }).populate('Materia');
        res.render('Alumno_MesaExamen', { mesasDisponiles });
    } catch (error) {
        console.error('Error al obtener las mesas activas:', error);
        res.status(500).send('Error del servidor');
    }
};

exports.obtenerMesasSegunAlum = async (req, res) => {
    try {
        const documentoAlum = req.params.numDoc;
        
        //busco el alumno por su numero de documento
        const alumno = await Alumno.findOne({ numDocAlumn: documentoAlum });
        // Obtengo el plan de estudio del alumno que se quiere inscribir
        const planEstudioDelAlumno = await PlanEstudio.findOne({ alumnos: alumno._id }).populate('materias');
        // Si hay un plan de estudio le saco las materias
        const materiasDelAlumno = planEstudioDelAlumno ? planEstudioDelAlumno.materias : [];
        if (!materiasDelAlumno.length) {
            return res.render('Alumno_MesaExamen', { mesasDisponiles: [] });
        }
        // Busco las mesas para esas materias
        const mesasDisponiles = await Mesa.find({
            Materia: { $in: materiasDelAlumno },
            estadoActual: 'activa'
        })

        if(mesasDisponiles){
            return res.render('Alumno_MesaExamen', { mesasDisponiles });
        }
        return res.render('Alumno_MesaExamen', { mesasDisponiles: [] });
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

exports.verificarPeermisoParaRendir = async (req, res) => {
    try {
        //traigo el id del alumno logueado
        const alumnoId = await IdAlumLogueado(req, res); 
        if(!alumnoId){
            return res.status(401).send('No hay un alumno logueado');
        }
        //traigo el id de la mesa
        const { mesaId } = req.body;
        console.log("idAlumno: ", alumnoId, "\n idMesa: ", mesaId);
        // Traigo la mesa con sus materias y alumnos
        const mesa = await Mesa.findById(mesaId)
            .populate({
                path: 'Materia',
                populate: { path: 'correlativas' }
            })
            .populate('Alumno');
        if (!mesa) {
            return res.status(404).json({ mensaje: "Mesa no encontrada" });
        }
        if (mesa.estadoActual == 'suspendida') {
            return res.status(404).json({ mensaje: "Mesa suspendida" });
        }
        //aca habria que agregar la validacion para ver cuantas veces ya rindio la mesa
        // Verificar si el alumno ya está inscrito en la mesa
        const inscripcionExistente = await verificarInscripcionExistente(alumnoId, mesa.Alumno);
        if (inscripcionExistente) {
            return res.status(400).json({ mensaje: "Este alumno ya está inscripto en la mesa" });
        }
        console.log("Materia a rendir de la mesa: \n", mesa.Materia);
        // Verificar si el alumno aprobó las correlativas
        const correlativasAprobadas = await verificarCorrelativas(alumnoId, mesa.Materia);
        if (!correlativasAprobadas) {
            return res.status(403).json({ mensaje: "No puedes inscribirte, no has aprobado todas las correlativas" });
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
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

exports.verificarPermisoParaRendir = async (req, res) => {
    try {
        const { alumnoId, mesaId } = req.params;

        console.log("idAlumno: ", alumnoId, "\n idMesa: ", mesaId);

        // Traigo la mesa con sus materias y alumnos
        const mesa = await Mesa.findById(mesaId)
            .populate({
                path: 'Materia',
                populate: { path: 'correlativas' }
            })
            .populate('Alumno');

        if (!mesa) {
            return res.status(404).json({ mensaje: "Mesa no encontrada" });
        }

        if (mesa.estadoActual == 'suspendida') {
            return res.status(404).json({ mensaje: "Mesa suspendida" });
        }

        //aca habria que agregar la validacion para ver cuantas veces ya rindio la mesa

        // Verificar si el alumno ya está inscrito en la mesa
        const inscripcionExistente = await verificarInscripcionExistente(alumnoId, mesa.Alumno);
        if (inscripcionExistente) {
            return res.status(400).json({ mensaje: "Este alumno ya está inscripto en la mesa" });
        }
        console.log("Materia a rendir de la mesa: \n", mesa.Materia);

        // Verificar si el alumno aprobó las correlativas
        const correlativasAprobadas = await verificarCorrelativas(alumnoId, mesa.Materia);
        if (!correlativasAprobadas) {
            return res.status(403).json({ mensaje: "No puedes inscribirte, no has aprobado todas las correlativas" });
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
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

// Función para verificar si el alumno ya está inscrito en la mesa
async function verificarInscripcionExistente(alumnoId, AlumnosParaVerificar) {
    try {
        const alumnoYaInscripto = AlumnosParaVerificar.some(alumno => alumno._id.toString() === alumnoId);
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
                estadoActual: { $in: ['acreditado'] } //Trae las que estan aprobadas solamente
            });

            console.log("\n Correlativas necesarias para rendir: \n", materiaParaRendir.correlativas);
            console.log("---------------------------------------------------------");
            console.log("\n Estado de las correlatvias del alumno logueado: \n", estadoAlumnoCorrelativas);
            console.log("---------------------------------------------------------");

            // devuelvo true o false dependiedno si aprobó todas las correlativas
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
            console.log('estado del alumno en la materia de la mesa:', alumEstado)
            switch (alumEstado.estadoActual) {
                case "libre":
                case "regular":
                    mesa.Alumno.push(alumnoId);
                    await mesa.save();
                    return res.status(200).json({ mensaje: "Inscripción realizada con éxito" });
                case "desaprobado":
                    return res.status(403).json({ mensaje: "No puede inscribirse, materia desaprobada" });
                case "acreditado":
                    return res.status(403).json({ mensaje: "No puede inscribirse, esta materia ya está acreditada" });
                default:
                    return res.status(400).json({ mensaje: "Estado de la materia no válido" });
            }
        } else {
            return res.status(404).json({ mensaje: "No se encontró el estado de la materia para el alumno" });
        }
    } catch (error) {
        console.error("Error al verificar el estado de la materia:", error.message);
        return res.status(500).json({ mensaje: "Error al verificar el estado de la materia" });
    }
}

