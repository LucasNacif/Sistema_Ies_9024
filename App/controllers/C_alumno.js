const Alumno = require("../../models/Alumno");
const PlanEstudio = require("../../models/PlanEstudio");

//METODOS PARA EL MANEJO DE ALUMNOS POR PARTE DEL ADMIN:

exports.nuevoAlumnoPlanDeEstudio = async (req, res) => {
  try {
    
    //traemos los datos del alumno y el id del plan de estudi
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
      curso,
      tituloSecundario,
      psicofisico,
      partidaNacim,
      dniActualizado,
      analiticoFiel,
      antecedenPen,
    });

    //primero traer los datos del plan de estudio donde se va a guardar el alumno
    const planEstudio =  PlanEstudio.findOneAndUpdate(
      {_id: idPlanEstudioSeleccionado},
      { $push: { alumnos: alumno._id, } },
      { new: true }
    );
    
    if(planEstudio){
      //guardamos ese alumno
      await alumno.save();

      console.error("planEstudio actualizado ", (await planEstudio).toString());
      console.error("alumno Guardado ", alumno.toString());

      return res.redirect(`/planEstudio/${idCarrera}?success=Alumno agregado exitosamente.`);
    }
  
  } catch (error) {
    console.error(error);
    res.redirect(`/planEstudio/${idCarrera}?error=No se pudo agregar el alumno.`);
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
exports.modificarEstado = async (req, res) => {
  const { idAlumno, estado } = req.body;
  try {
    const alumno = await Alumno.findById( idAlumno );

    if (!alumno) {
      console.log("Alumno no encontrado")
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
