const AlumnoEstado = require("../../models/AlumnoEstado");
const Alumno = require("../../models/Alumno");
const Materia = require("../../models/Materia");
const PlanEstudios = require("../../models/PlanEstudio");

exports.crearAlumnoEstado = async (req, res) => {
  try {
    const { nombreAlumno, nombreMateria, estadoActual, fecha } = req.body;

    //console.log("Datos recibidos:", { nombreAlumno, nombreMateria });

    const alumno = await Alumno.findOne({ nombreCompleto: nombreAlumno });
    if (!alumno) {
      console.log("Alumno no encontrada");
      throw new Error("Alumno no encontrado");
    }

    // Buscar la materia por nombre
    const materia = await Materia.findOne({ nombreMateria: nombreMateria });
    if (!materia) {
      console.log("Materia no encontrada");
      throw new Error("Materia no encontrada");
    }

    const nuevoAlumnoEstado = new AlumnoEstado({
      idAlumno: alumno._id,
      idMateria: materia._id,
      estadoActual: estadoActual,
      fecha: new Date(),
    });

    await nuevoAlumnoEstado.save();

    res.status(201).json({ message: "AlumnoEstado creado exitosamente" });
  } catch (error) {
    console.log(error.message);
    res.status(501).json({ message: "Error al crear el AlumnoEstado" });
  }
};
exports.buscarAlumnoYMaterias = async (req, res) => {
  try {
    const { numDocAlumn } = req.params;

    // Buscar al alumno por número de documento
    const alumno = await Alumno.findOne({ numDocAlumn });
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }
    //console.log(alumno)

    // Buscar el plan de estudios del alumno
    const planEstudios = await PlanEstudios.findOne({
      alumnos: alumno._id,
    }).select("nombre materias").populate("materias", "nombreMateria");

    //console.log(planEstudios)

    if (!planEstudios) {
      return res.status(404).json({
        message: "No se encontró el plan de estudios para este alumno",
      });
    }

    // Obtener las materias del plan de estudios
    const materiasDelPlan = planEstudios.materias;
    //console.log(materiasDelPlan)
    // Buscar los estados de las materias que ya tiene cargadas el alumno
    const estadosExistentes = await AlumnoEstado.find({
      idAlumno: alumno._id,
      idMateria: { $in: materiasDelPlan }
    }).lean();

    //console.log(estadosExistentes)

    // Crear un objeto para mapear los estados existentes por materia
    const estadosMap = {};

    estadosExistentes.forEach(estado => {
      estadosMap[estado.idMateria.toString()] = estado;
    });

    //console.log(estadosMap);

    // Crear un array con todas las materias y sus estados, incluyendo la fecha
    const materiasConEstado = materiasDelPlan.map(materia => {
      const estado = estadosMap[materia._id.toString()];
      return {
        materia: materia.nombreMateria,
        estadoActual: estado?.estadoActual || 'Sin Estado', // Encadenamiento
        fecha: estado?.fecha || null //encadenamiento tambien por las dudas
      };
    });

    console.log(materiasConEstado);

    // Renderizar la vista con todas las materias y sus estados
    res.render('Admin_AlumnoEstado', { materiasConEstado });
  } catch (error) {
    console.error("Error al buscar el alumno y sus materias:", error.message);
    res
      .status(500)
      .json({ message: "Error al buscar el alumno y sus materias" });
  }

};

exports.modificarEstadoAlumno = async (req, res) => {
  try {
    const { idAlumno, idMateria } = req.params;
    const { estadoNuevo } = req.body;

    // Busca el estado de la materia del alumno utilizando ambos IDs
    const estadoMateria = await AlumnoEstado.findOne({
      idAlumno: idAlumno,
      idMateria: idMateria,
    });

    if (!estadoMateria) {
      return res.status(404).send("No se encontró el estado de la materia para este alumno");
    }
    console.log(estadoMateria)

    // Actualiza solo el estadoActual
    estadoMateria.estadoActual = estadoNuevo;

    await estadoMateria.save(); // Guarda los cambios en la base de datos

    res.status(200).send(estadoMateria); // Devuelve el objeto actualizado
  } catch (err) {
    console.error("Error al modificar el estado del alumno:", err);
    res.status(500).send("Error al modificar el estado del alumno");
  }
};


