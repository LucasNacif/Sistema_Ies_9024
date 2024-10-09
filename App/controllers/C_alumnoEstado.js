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
    // Buscar el plan de estudios del alumno
    const planEstudios = await PlanEstudios.findOne({
      alumnos: alumno._id,
    }).select("nombre materias").populate("materias", "nombreMateria");
    console.log(materiasDelPlan);
    if (!planEstudios) {
      return res.status(404).json({
        message: "No se encontró el plan de estudios para este alumno",
      });
    }
    console.log(planEstudios)

    // Obtener materias
    const materiasDelPlan = planEstudios.materias.map(materia => materia._id);
    console.log(materiasDelPlan);

    // Buscar los estados de las materias de ese alumno
    const estadosMaterias = await AlumnoEstado.find({
      idAlumno: alumno._id, // Filtrar por el ID del alumno
      idMateria: { $in: materiasDelPlan }// Filtrar por las materias del plan de estudios
    }).populate('idMateria'); // Popular la información de las materias

    // Convertir la estructura anidada en una más plana
    // const estadosMateriasA = estadosMaterias.map(estado => {
    //   return {
    //     estadoActual: estado.estadoActual,
    //     fecha: estado.fecha,
    //     nombreMateria: estado.idMateria.nombreMateria // Extrae directamente el nombre de la materia
    //   };
    // });
    //console.log(estadosMaterias);

    // Responder con la lista de materias y sus estados
    res.render('Admin_AlumnoEstado', { estadosMaterias });
  } catch (error) {
    console.error("Error al buscar el alumno y sus materias:", error.message);
    res
      .status(500)
      .json({ message: "Error al buscar el alumno y sus materias" });
  }
};
