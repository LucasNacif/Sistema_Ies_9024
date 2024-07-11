// const Clases = require("../../models/clases");
// const Modelo = require("../../models/modelo");

// function nuevo(req, res) {
//   let newAlumno = new Clases.Alumno(
//     req.body.numDocAlumn,
//     req.body.emailAlumm,
//     req.body.nombreCompleto,
//     req.body.nombre,
//     parseInt(req.body.corte),
//     req.body.tituloSecundario,
//     req.body.psicofisico,
//     req.body.partidaNacim,
//     req.body.dniActualizado,
//     req.body.analiticoFiel,
//     req.body.antecedenPen
//   );

//   Modelo.guardar(newAlumno);
//   console.log(`Nuevo user---> \n${JSON.stringify(newAlumno)}`);
//   res.redirect("/admin");
// }

// function obtenerAlumnosTxt(req, res) {
//   try {
//     const alumnos = Modelo.obtenerAlumnos();

//     if (alumnos.length <= 0) {
//       res.render("listarAlumnos", { alumnos: [], error: "No se encontraron alumnos" });
//     } else {
//       res.render("listarAlumnos", { alumnos: alumnos, error: null });
//     }
//   } catch (error) {
//     console.error("Error al obtener los alumnos:", error);
//     res.render("listarAlumnos", { alumnos: [], error: "Error al obtener los alumnos" });
//   }
// }

// module.exports = { nuevo, obtenerAlumnosTxt };
