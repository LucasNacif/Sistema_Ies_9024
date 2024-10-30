const AlumnoEstado = require("../../models/AlumnoEstado");
const Alumno = require("../../models/Alumno");
const Materia = require("../../models/Materia");
const PlanEstudios = require("../../models/PlanEstudio");
const mongoose = require('mongoose');

exports.crearAlumnoEstado = async (req, res) => {
  try {
    const { nombreAlumno, nombreMateria, estadoActual } = req.body;

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
      historialEstados: [{ estado: estadoActual, fecha: new Date() }]
    });

    await nuevoAlumnoEstado.save();

    res.status(201).json({ message: "AlumnoEstado creado exitosamente" });
  } catch (error) {
    console.log(error.message);
    res.status(501).json({ message: "Error al crear el AlumnoEstado: ${error.message}" });
  }
};

exports.buscarAlumnoYMaterias = async (req, res) => {
  try {
    const { numDocAlumn } = req.params;

    // Buscar al alumno por número de documento
    const alumno = await Alumno.findOne({ numDocAlumn: numDocAlumn }); // Ajusté aquí el campo a 'numDocumento'
    if (!alumno) {
      return res.status(404).json({ message: "Alumno no encontrado" });
    }

    // Buscar el plan de estudios del alumno
    const planEstudios = await PlanEstudios.findOne({
      alumnos: alumno._id,
    }).select("nombre materias").populate("materias", "nombreMateria");

    if (!planEstudios) {
      return res.status(404).json({
        message: "No se encontró el plan de estudios para este alumno",
      });
    }

    // Obtener las materias del plan de estudios
    const materiasDelPlan = planEstudios.materias;

    // Buscar los estados de las materias que ya tiene cargadas el alumno
    const estadosExistentes = await AlumnoEstado.find({
      idAlumno: alumno._id,
      idMateria: { $in: materiasDelPlan.map(m => m._id) }, // Asegúrate de que usas los IDs correctos
    }).lean();

    // Crear un objeto para mapear los estados existentes por materia
    const estadosMap = estadosExistentes.reduce((map, estado) => {
      map[estado.idMateria.toString()] = estado;
      return map;
    }, {});

    // Crear un array con todas las materias y sus estados, incluyendo la fecha
    const materiasConEstado = materiasDelPlan.map(materia => {
      const estado = estadosMap[materia._id.toString()];
      const ultimoEstado = estado?.historialEstados?.slice(-1)[0]; // Obtiene el último estado

      return {
        materia: materia.nombreMateria,
        estado: ultimoEstado ? ultimoEstado.estado : 'Sin Estado', // Último estado del historial o 'Sin Estado'
        fecha: ultimoEstado ? new Date(ultimoEstado.fecha).toISOString().split('T')[0] : null, // Última fecha del historial en formato 'YYYY-MM-DD'
      };
    });

    // Renderizar la vista con todas las materias y sus estados
    res.render('Admin_AlumnoEstado', { materiasConEstado });
  } catch (error) {
    console.error("Error al buscar el alumno y sus materias:", error.message);
    res.status(500).json({ message: "Error al buscar el alumno y sus materias" });
  }
};




// Controlador para obtener el estado del alumno en una materia
exports.obtenerEstadoAlumno = async (req, res) => {
  try {
    const { numDocAlumn } = req.params;

    // Buscar el estado del alumno en la materia
    const alumnoEstado = await AlumnoEstado.findOne(numDocAlumn);

    if (!alumnoEstado) {
      return res.status(404).json({ mensaje: 'No se encontró el estado para este alumno y materia.' });
    }

    // Obtener el último registro de historialEstados
    const ultimoEstado = alumnoEstado.historialEstados[alumnoEstado.historialEstados.length - 1];

    // Preparar la respuesta
    const materiasConEstado = {
      idAlumno,
      idMateria,
      estado: ultimoEstado.estado,
      fecha: ultimoEstado.fecha,
    };

    return res.status(200).json(materiasConEstado);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error al obtener el estado del alumno.', error });
  }
}



exports.actualizarEstadoAlumno = async (req, res) => {
  const id = req.params.id;
  const nuevoEstado = req.body.estado; // El nuevo estado debe venir en el cuerpo de la solicitud

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de estado no válido' });
  }
  if (!['regular', 'libre', 'acreditado', 'desaprobado'].includes(nuevoEstado)) {
    return res.status(400).json({ message: 'Estado no válido' });
  }

  try {
    const alumnoEstado = await AlumnoEstado.findById(id);
    if (!alumnoEstado) {
      return res.status(404).json({ message: 'Estado no encontrado' });
    }

    // Agrega el nuevo estado y fecha actual al final de los arrays
    alumnoEstado.estadoActual.push(nuevoEstado);
    alumnoEstado.fecha.push(new Date());

    // Guarda los cambios en el documento
    await alumnoEstado.save();

    // Devuelve el último estado y fecha cargados
    res.json({
      message: 'Estado actualizado correctamente',
      estadoActual: alumnoEstado.estadoActual[alumnoEstado.estadoActual.length - 1],
      fecha: alumnoEstado.fecha[alumnoEstado.fecha.length - 1],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el estado' });
  }
};


// Eliminar una carrera
exports.eliminarEstadoAlumno = async (req, res) => {
  const id = req.params.id;
  console.log('ID recibido:', id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de estado no válido' });
  }

  try {
    const alumnoEstado = await AlumnoEstado.findByIdAndUpdate(
      id,
      { estado: "Sin estado" },
      { new: true }
    );

    if (!alumnoEstado) {
      return res.status(404).json({ message: 'Estado no encontrada' });
    }
    res.json({ message: 'Estado eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar estado' });
  }
};


