const Alumno = require("../../models/entities/Alumno");
const AlumnoEstado = require("../../models/entities/AlumnoEstado");
// controller para crear un alumno
exports.agregar = async (req, res) => {
  try {
    const {
      numDocAlumn,
      emailAlumm,
      nombreCompleto,
      nombre,
      corte,
      tituloSecundario,
      psicofisico,
      partidaNacim,
      dniActualizado,
      analiticoFiel,
      antecedenPen,
    } = req.body;

    const alumno = new Alumno({
      numDocAlumn,
      emailAlumm,
      nombreCompleto,
      nombre,
      corte,
      tituloSecundario,
      psicofisico,
      partidaNacim,
      dniActualizado,
      analiticoFiel,
      antecedenPen,
    });
    await alumno.save();

    const fechaInicio = new Date();
    const fechaFin = new Date(fechaInicio);
    fechaFin.setFullYear(fechaFin.getFullYear() + 3);

    const alumnoEstado = new AlumnoEstado({
      fechaInicioCursado: fechaInicio,
      fechaFinCursado: fechaFin,
      alumno: alumno._id,
    });
    await alumnoEstado.save();

    alumno.Estado.push(alumnoEstado._id);
    alumno.save();
    res
      .status(201)
      .redirect("/alumno/listar?message=Alumno agregado exitosamente");
  } catch (error) {
    console.log(error.message);
    res.status(500).redirect("/alumno/listar?error=Error al agregar alumno");
  }
};

// controller para obtener todos los alumnos
exports.listarAlumnos = async (req, res) => {
  try {
    const alumnos = await Alumno.find();
    res.render("listarAlumnos", { alumnos });
  } catch (error) {
    console.error("Error al obtener alumnos:", error.message);
    res.status(500).send("Error al obtener alumnos");
  }
};

exports.modificarAlumno = async (req, res) => {
  try {
    const AlumnoID = await Alumno.findOne({
      numDocAlumn: req.params.numDocAlumn,
    });
    if (!AlumnoID) {
      return res.status(404).send("No se encontró");
    }

    for (let atributo in req.body) {
      if (req.body.hasOwnProperty(atributo)) {
        AlumnoID[atributo] = req.body[atributo];
      }
    }

    await AlumnoID.save();

    res.status(200).send(AlumnoID);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.traerUnAlumno = async (req, res) => {
  try {
    const AlumnoID = await Alumno.findOne({
      numDocAlumn: req.params.numDocAlumn,
    }).populate("Estado");

    if (!AlumnoID) {
      return res.status(404).send("No se encontró");
    }
    res.status(200).json(AlumnoID);
  } catch (err) {
    res.status(500).send(`Error al recuperar el alumno: ${err.message}`);
  }
};

exports.eliminarAlumno = async (req, res) => {
  try {
    const AlumnoID = await Alumno.findOne({
      numDocAlumn: req.params.numDocAlumn,
    });
    if (!AlumnoID) {
      return res.status(404).send("Alumno no encontrado");
    } else {
      const fechaFin = new Date();
      const alumnoEstado = new AlumnoEstado({
        fechaFinCursado: fechaFin,
        alumno: alumnoID._id,
      });
      await alumnoEstado.save();

      AlumnoID.Estado(alumnoEstado._id);
      await AlumnoID.save();
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
