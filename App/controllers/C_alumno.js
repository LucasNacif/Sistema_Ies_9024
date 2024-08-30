const Alumno = require("../../models/entities/Alumno");

// controller para crear un alumno
exports.nuevo = async (req, res) => {
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
    const alumnos = await Alumno.find();
    res.render("listarAlumnos", { alumnos });
  } catch (error) {
    console.error("Error al obtener alumnos:", error.message);
    res.status(500).send("Error al obtener alumnos");
  }
};

exports.conseguirAlumno = async (req, res) => {
  try {
    const AlumnoID = await Alumno.findOne({
      numDocAlumn: req.params.numDocAlumn,
    });
    if (!AlumnoID) {
      return res.status(404).send("No se encontró");
    }

    for (let key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        AlumnoID[key] = req.body[key];
      }
    }

    await AlumnoID.save();

    res.status(200).send(AlumnoID);
  } catch (err) {
    res.status(500).send(err);
  }
};

/*exports.eliminarAlumno = async (req, res) => {
  try {
      const AlumnoID = await Alumno.findByIdAndDelete(req.params.numDocAlumn);
      if (!AlumnoID) {
          return res.status(404).send('Alumno no encontrado');
      }
      res.status(200).send(AlumnoID);
  } catch (err) {
      res.status(500).send(err);
  }
};*/
