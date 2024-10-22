const Materia = require("../../models/entities/Materia");

exports.agregarMateria = async (req, res) => {
  try {
    const { nombreMateria, materCorrel } = req.body;

    const materia = new Materia({
      nombreMateria,
      materCorrel,
    });

    await materia.save();

    res.status(201).json({ message: "Materia creada exitosamente" });
  } catch (error) {
    console.log(error.message);
    res.status(501).json({ message: "Error al crear la materia" });
  }
};

exports.listarMaterias = async (req, res) => {
  try {
    const materias = await Materia.find();
    res.status(200).send(materias);
  } catch (error) {
    console.error("Error al obtener las materias:", error.message);
    res.status(500).send("Error al obtener materia");
  }
};

exports.modificarMateria = async (req, res) => {
  try {
    const materiaID = await Materia.findOne({
      nombreMateria: req.params.nombreMateria,
    });
    if (!materiaID) {
      return res.status(404).send("No se encontró");
    }

    for (let atributo in req.body) {
      if (req.body.hasOwnProperty(atributo)) {
        materiaID[atributo] = req.body[atributo];
      }
    }

    await materiaID.save();

    res.status(200).send(materiaID);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.eliminarMateria = async (req, res) => {
  try {
    const materiaNombre = await Materia.findByIdAndDelete({
      nombreMateria: req.params.nombreMateria,
    });
    if (!materiaNombre) {
      return res.status(404).send("Alumno no encontrado");
    }
    res.status(200);
  } catch (err) {
    res.status(500).send(err);
  }
};
