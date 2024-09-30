const Mesa = require("../../models/Mesa");
const AlumnoEstado = require("../../models/AlumnoEstado");

exports.obtenerMesasActivas = async (req, res) => {
    try {
        const mesasDisponibles = await Mesa.find({
            estadoActual: 'activa'
        }).populate({
            path: 'Materia',
            populate: { path: 'correlativas' }
        });
        console.log(mesasDisponibles);
        return res.status(200).json(mesasDisponibles);
    } catch (error) {
        console.error("Error al obtener mesas:", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}
exports.verificarPermisoParaRendir = async (req, res) => {
    try {
        const { alumnoId, mesaId } = req.params;
        console.log("idAlumno: ", alumnoId, "\n idMesa: ", mesaId);

        // Traigo la materia de la mesa
        const mesa = await Mesa.findById(mesaId).populate({
            path: 'Materia',
            populate: { path: 'correlativas' } // Tambien traigo sus correlativas
        });

        if (!mesa) {
            return res.status(404).json({ mensaje: "Mesa no encontrada" });
        }

        if (mesa.estadoActual == 'suspendida') {
            return res.status(404).json({ mensaje: "Mesa suspendida" });
        }

        //saco la materia del mesa y la asigno a ota variable
        const materiaParaRendir = mesa.Materia;
        console.log("Materias a rendir de la mesa: \n", materiaParaRendir);

        // Verifico si tiene correlativas
        if (materiaParaRendir.correlativas.length > 0) {
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

            // Verifico si aprobó todas las correlativas
            if (estadoAlumnoCorrelativas.length !== materiaParaRendir.correlativas.length) {
                return res.status(403).json({ mensaje: "No puedes inscribirte, no has aprobado todas las correlativas" });
            }
            console.log("aprobó todas las correlativas");
        }


        //una vez que revicé si aprobó las correlativas de la materia, reviso si aprobó la materia de la mesa que va a rendir

        // Traigo el estado del alumno en la materia de la mesa
        const alumEstado = await AlumnoEstado.findOne({
            idAlumno: alumnoId,
            idMateria: materiaParaRendir._id,
        });

        // Verifico el estado actual del alumno en la materia
        if (alumEstado) {
            console.log("Estado de la materia de la mesa: \n", alumEstado);
            switch (alumEstado.estadoActual) {
                case "libre":
                case "regular":
                    return res.status(200).json({ mensaje: "Puede inscribirse a la mesa" });
                case "desaprobado":
                    return res.status(403).json({ mensaje: "No puede inscribirse, materia desaprobada" });
                case "acreditado":
                    return res.status(403).json({ mensaje: "No puede inscribirse, esta materia ya se encuentra acreditada" });
                default:
                    return res.status(400).json({ mensaje: "Estado de la materia no válido" });
            }
        } else {
            return res.status(404).json({ mensaje: "No se encontró el estado de la materia para el alumno" });
        }

    } catch (error) {
        console.error("Error al obtener mesas disponibles:", error.message);
        return res.status(500).json({ mensaje: "Error en el servidor" });
    }
};