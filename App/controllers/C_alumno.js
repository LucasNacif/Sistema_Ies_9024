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

    //primero traer los datos del plan de estudio donde se va a guardar el alumno
    const planEstudio =  PlanEstudio.findOneAndUpdate(
      {_id: idPlanEstudioSeleccionado},
      { $push: { alumnos: alumno._id, } },
      { new: true }
    );
    
    if(planEstudio){
      //guardamos ese alumno
      await alumno.save();
    }

    console.error("planEstudio actualizado ", (await planEstudio).toString());
    console.error("alumno Guardado ", alumno.toString());
    
    res.redirect("/alumno?message=Alumno agregado correctamente");
  } catch (error) {
    console.error(error);
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
    const alumnos = await Alumno.find({ banderaBooleana: true });

    if (alumnos.length === 0) {
      return res.status(200).json({ mensaje: "No hay alumnos activos" });
    }

    res.status(200).json(alumnos);
  } catch (error) {
    console.error("Error al obtener alumnos:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
