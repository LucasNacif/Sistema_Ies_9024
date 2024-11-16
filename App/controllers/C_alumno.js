const Alumno = require("../../models/Alumno");
const PlanEstudio = require("../../models/PlanEstudio");

exports.nuevoAlumnoPlanDeEstudio = async (req, res) => {
  try {

    //traemos los datos del alumno y el id del plan de estudio
    const {
      numDocAlumn,
      nombreCompleto,
      nombre,
      corte,
      emailAlumn,
      tituloSecundario,
      psicofisico,
      partidaNacim,
      dniActualizado,
      analiticoFiel,
      antecedenPen,
      idPlanEstudioSeleccionado,
      idCarrera,
    } = req.body;

    // busco el alumno por este num de doc para saber si esta guardado
    const alumnoExistente = await Alumno.findOne({ numDocAlumn });
    if (alumnoExistente) {
      return res.redirect(`/planEstudio/${idCarrera}?error=El alumno ya existe.`);
    }
    const alumno = new Alumno({
      numDocAlumn,
      nombreCompleto,
      nombre,
      corte,
      emailAlumn,
      tituloSecundario,
      psicofisico,
      partidaNacim,
      dniActualizado,
      analiticoFiel,
      antecedenPen,
    });

    //primero traer los datos del plan de estudio donde se va a guardar el alumno
    const planEstudio = PlanEstudio.findOneAndUpdate(
      { _id: idPlanEstudioSeleccionado },
      { $push: { alumnos: alumno._id, } },
      { new: true }
    );

    if (planEstudio) {
      //guardamos ese alumno
      await alumno.save();
      return res.redirect(`/planEstudio/${idCarrera}?success=Alumno agregado exitosamente.`);
    }
  } catch (error) {
    console.error(error);
    res.redirect(`/planEstudio/${idCarrera}?error=No se pudo agregar el alumno.`);
  }
};
exports.modificarEstado = async (req, res) => {
  const { idAlumno, estado } = req.body;
  try {
    const alumno = await Alumno.findById(idAlumno);

    if (!alumno) {
      return res.status(404).json({ error: "Alumno no encontrado" });
    }

    if (alumno.banderaBooleana === estado) {
      return res.status(405).json({ error: "Este alumno ya se encontraba en ese estado" });
    }

    await Alumno.findOneAndUpdate(
      { _id: idAlumno },
      { $set: { banderaBooleana: estado } },
      { new: true }
    );

    res.status(200).json({ message: "Alumno modificado exitosamente" });
  } catch (error) {
    console.error("Error al dar de baja el alumno:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
exports.modificarAlumno = async (req, res) => {
  try {
    const {
      numDocAlumn,
      nombreCompleto,
      corte,
      emailAlumn,
      tituloSecundario,
      psicofisico,
      partidaNacim,
      dniActualizado,
      analiticoFiel,
      antecedenPen,
    } = req.body;

    const alumnoActualizado = await Alumno.findOneAndUpdate(
      { numDocAlumn },
      {
        nombreCompleto,
        corte,
        emailAlumn,
        tituloSecundario,
        psicofisico,
        partidaNacim,
        dniActualizado,
        analiticoFiel,
        antecedenPen,
      },
      { new: true }
    );

    if (alumnoActualizado) {
       return res.status(200).json({ message: "Alumno modificado correctamente" });
    } else {
      return res.status(500).json({ message: "Error al modificar alumno" });
    }
  } catch (error) {
    console.error("Error al modificar el alumno:", error.message);
    return res.status(500).json({ message: "Error interno del servidor" }); 
  }
};

