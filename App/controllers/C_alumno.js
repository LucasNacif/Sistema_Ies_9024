const Alumno = require("../../models/Alumno");
const Mesa = require("../../models/Mesa");
const AlumnoEstado = require("../../models/AlumnoEstado");
const mongoose = require('mongoose');

//METODOS PARA EL MANEJO DE ALUMNOS POR PARTE DEL ADMIN:
exports.nuevo = async (req, res) => {
  try {
    const {
      numDocAlumn,
      nombreCompleto,
      nombre,
      corte,
      emailAlumn,
      curso,
      tituloSecundario,
      psicofisico,
      partidaNacim,
      dniActualizado,
      analiticoFiel,
      antecedenPen,
    } = req.body;

    // busco el alumno por este num de doc para saber si esta guardado
    const alumnoExistente = await Alumno.findOne({ numDocAlumn });
    if (alumnoExistente) {
      return res.redirect("/alumno?error=El DNI ya está registrado");
    }

    const alumno = new Alumno({
      numDocAlumn,
      nombreCompleto,
      nombre,
      corte,
      emailAlumn,
      curso,
      tituloSecundario,
      psicofisico,
      partidaNacim,
      dniActualizado,
      analiticoFiel,
      antecedenPen,
    });

    await alumno.save();
    //exito
    res.redirect("/alumno?message=Alumno agregado correctamente");
  } catch (error) {
    console.log(error);
    res.redirect("/alumno?error=Error al agregar alumno");
  }
};
exports.traerPorDoc = async (req, res) => {

  const { numDocAlumn } = req.params;
  if (!numDocAlumn) {
    return res.status(404).json({ error: "Número de documento requerido" });
  }
  try {
    const alumno = await Alumno.findOne({ numDocAlumn });
    if (!alumno) {
      return res.status(404).json({ error: "Alumno no encontrado" });
    }

    res.status(200).json(alumno);
  } catch (error) {
    console.error("Error al obtener el alumno:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
exports.darDeBaja = async (req, res) => {

  const { numDocAlumn } = req.params;
  if (!numDocAlumn) {
    return res.status(400).json({ error: "Número de documento requerido" });
  }

  try {
    const alumno = await Alumno.findOne({ numDocAlumn });

    if (!alumno) {
      return res.status(404).json({ error: "Alumno no encontrado" });
    }

    if (!alumno.banderaBooleana) {
      return res.status(405).json({ error: "Este alumno ya se encuentra dado de baja" });
    }

    // Actualizar el estado del alumno a dado de baja
    await Alumno.findOneAndUpdate(
      { numDocAlumn },
      { $set: { banderaBooleana: false } },
      { new: true }
    );

    res.status(200).json({ message: "Alumno dado de baja exitosamente" });
  } catch (error) {
    console.error("Error al dar de baja el alumno:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
exports.modificarAlumno = async (req, res) => {
  try {
    const {
      numDocAlumn,
      emailAlumn,
      nombreCompleto,
      nombre,
      corte,
      curso,
      tituloSecundario,
      psicofisico,
      partidaNacim,
      dniActualizado,
      analiticoFiel,
      antecedenPen,
    } = req.body;


    if (!numDocAlumn) {
      return res.status(400).redirect("/alumno?error=Número de documento requerido");
    }

    const alumno = await Alumno.findOne({ numDocAlumn });

    if (!alumno) {
      return res.status(404).redirect("/alumno?error=Alumno no encontrado");
    }

    // Actualizar el alumno
    const alumnoActualizado = await Alumno.findOneAndUpdate(
      { numDocAlumn },
      {
        nombreCompleto,
        nombre,
        corte,
        emailAlumn,
        curso,
        tituloSecundario,
        psicofisico,
        partidaNacim,
        dniActualizado,
        analiticoFiel,
        antecedenPen,
      },
      { new: true }
    );

    // Verificar si la actualización fue exitosa
    if (alumnoActualizado) {
      res.status(200).redirect("/alumno?message=Alumno modificado correctamente");
    } else {
      res.status(500).redirect("/alumno?error=Error al modificar alumno");
    }
  } catch (error) {
    console.error("Error al modificar el alumno:", error.message);
    res.status(500).redirect("/alumno?error=Error interno del servidor");
  }
};
exports.obtenerAlumnosActivos = async (req, res) => {
  try {
    const { activos } = req.query;

    const filtro = {};
    if (activos === "true") {
      filtro.banderaBooleana = true;
    }

    const alumnos = await Alumno.find(filtro);

    if (alumnos.length === 0) {
      return res.status(200).json({ mensaje: "No hay alumnos activos" });
    }

    res.status(200).json(alumnos);
  } catch (error) {
    console.error("Error al obtener alumnos:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


//METODOS PARA ALUMNOS LOGUEADOS
exports.obtenerMesas = async (req, res) => {
  try {
    const mesasDisponibles = Mesa.find();
    res.status(200).json(mesasDisponibles);

  } catch (error) {
    console.error("Error al obtener mesas:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
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
