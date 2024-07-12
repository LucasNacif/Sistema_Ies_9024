const Alumno = require("../../models/entities/Alumno");

// controller para crear un alumno
exports.nuevo = async (req, res) => {
    try {
        const { numDocAlumn, emailAlumm, nombreCompleto, nombre, corte, 
            tituloSecundario, psicofisico, partidaNacim, dniActualizado, analiticoFiel, antecedenPen } = req.body;
        
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
            antecedenPen
        });

        await alumno.save();
        res.status(201); //.send(alumno)
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error);
    }
};

// controller para obtener todos los alumnos
exports.listarAlumnos = async (req, res) => {
  try {
      const alumnos = await Alumno.find();
      res.render('listar', { alumnos });
  } catch (error) {
      console.error("Error al obtener alumnos:", error.message);
      res.status(500).send("Error al obtener alumnos");
  }
};
