const AlumnoEstado = require("../../models/AlumnoEstado");
const Alumno = require("../../models/Alumno");
const Materia = require("../../models/Materia");
const PlanEstudios = require("../../models/PlanEstudio");
const mongoose = require('mongoose');

exports.crearAlumnoEstado = async (req, res) => {
  try {
    const { numDocAlumn, nombreMateria, estadoActual } = req.body;
    console.log(numDocAlumn, nombreMateria, estadoActual)
    // Buscar el alumno
    const alumno = await Alumno.findOne({ numDocAlumn });
    if (!alumno) {
      console.log("Alumno no encontrado");
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    // Buscar la materia
    const materia = await Materia.findOne({ nombreMateria: nombreMateria });
    if (!materia) {
      console.log("Materia no encontrada");
      return res.status(404).json({ message: "Materia no encontrada" });
    }

    // Buscar si ya existe un estado para el alumno y la materia
    let alumnoEstado = await AlumnoEstado.findOne({ idAlumno: alumno._id, idMateria: materia._id });

    if (alumnoEstado) {
      // Si existe, añado el nuevo estado al historial
      alumnoEstado.historialEstados.push({ estado: estadoActual, fecha: new Date() });
      alumnoEstado.estadoActual = estadoActual;
      await alumnoEstado.save();
      res.status(200).json({ message: "Estado actualizado exitosamente" });
    } else {
      // Si no existe, crear un nuevo AlumnoEstado
      const nuevoAlumnoEstado = new AlumnoEstado({
        idAlumno: alumno._id,
        idMateria: materia._id,
        historialEstados: [{ estado: estadoActual, fecha: new Date() }],
        estadoActual: estadoActual
      });
      await nuevoAlumnoEstado.save();
      res.status(201).json({ message: "AlumnoEstado creado exitosamente" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: `Error al crear o actualizar el AlumnoEstado: ${error.message}` });
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
    const planEstudios = await PlanEstudios.findOne({ alumnos: alumno._id })
      .select("nombre materias")
      .populate("materias", "nombreMateria");

    if (!planEstudios) {
      return res.status(404).json({ message: "No se encontró el plan de estudios para este alumno" });
    }
    const materiasDelPlan = planEstudios.materias;

    // Buscar los estados de las materias que ya tiene cargadas el alumno
    const estadosExistentes = await AlumnoEstado.find({
      idAlumno: alumno._id,
      idMateria: { $in: materiasDelPlan },
    });

    const materiasConEstado = [];
    const materiasSinEstado = [];

    estadosExistentes.forEach(estado => {
      // Obtener el último estado válido del historial
      const ultimoEstado = estado.historialEstados?.slice().reverse().find(e => e.estado);

      // Encontrar el nombre de la materia asociada al estado
      const materia = materiasDelPlan.find(m => m._id.toString() === estado.idMateria.toString());

      const materiaConEstado = {
        id: estado._id,
        materia: materia ? materia.nombreMateria : null,
        estado: ultimoEstado ? ultimoEstado.estado : 'Sin Estado',
        fecha: ultimoEstado ? new Date(ultimoEstado.fecha).toISOString().split('T')[0] : null,
      };

      // Clasificar solo los estados que tienen "sin estado"
      if (materiaConEstado.estado.toLowerCase() === 'sin estado') {
        materiasSinEstado.push(materiaConEstado);
      } else {
        materiasConEstado.push(materiaConEstado);
      }
    });

    res.render("Admin_AlumnoEstado", { materiasConEstado, materiasSinEstado });
  } catch (error) {
    console.error("Error al buscar el alumno y sus materias:", error.message);
    res.status(500).json({ message: "Error al buscar el alumno y sus materias" });
  }
};


exports.eliminarEstadoAlumno = async (req, res) => {
  const id = req.params.id;
  //console.log('ID recibido:', id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de estado no válido' });
  }
}

exports.modificarEstadoAlumno = async (req, res) => {

  try {
    const { id } = req.params;
    const alumnoEstado = await AlumnoEstado.findById(id);

    if (!alumnoEstado) {
      return res.status(404).json({ message: 'Estado no encontrado' });
    }

    // Agregar un nuevo objeto en el historial con el estado "Sin estado" y la fecha actual
    alumnoEstado.historialEstados.push({
      estado: "sin estado",
      fecha: new Date() //la fecha actual
    });

    // Guardar los cambios en la base de datos
    await alumnoEstado.save();
    res.json({ message: 'Estado dado de baja correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al dar baja estado' });
  }
};




exports.obtenerHistorialEstados = async (req, res) => {
  try {
    // Obtén el ID del alumno del parámetro de la solicitud
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de alumno no válido' });
    }
    // Busca el estado del alumno por su ID y pobla el historial
    const alumnoEstado = await AlumnoEstado.findById(id)
      .select('historialEstados') // Selecciona solo el historial de estados

    if (!alumnoEstado) {
      return res.status(404).json({ message: 'Estado no encontrado' });
    }

    // Envía el historial de estados como respuesta
    res.status(200).json(alumnoEstado.historialEstados);
  } catch (error) {
    console.error('Error al obtener el historial de estados:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};


