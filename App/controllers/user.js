// const Clases = require("../../models/clases");
// const Modelo = require("../../models/modelo");

// function getData(req, res) {
//   res.send({ data: "Esto viene desde ruta" });
// }

// function nuevo(req, res) {
//   // Pasar 'req' y 'res' como parámetros
//   console.log("--nuevo(data)-->[controlador]");
//   // Accedo a los datos del formulario a través de 'req.body'
//   console.log(req.body);

//   let newAlumno = new Clases.Alumno(
//     req.body.nombreCompleto,
//     req.body.nombre,
//     parseInt(req.body.numDocAlumn),
//     parseInt(req.body.corte),
//     req.body.tituloSecundario,
//     req.body.psicofisico,
//     req.body.partidaNacim,
//     req.body.dniActualizado,
//     req.body.analiticoFiel,
//     req.body.antecedenPen
//   );
//   /* const AlumnoJson = {
//     nombre: newAlumno.nombre,
//     cohorte: newAlumno.cohorte,
//     email: newAlumno.email,
//     papeles: newAlumno.papeles,
//   };
//   const alumnoJSONString = JSON.stringify(AlumnoJson);*/

//   Modelo.guardar(newAlumno);

//   // Redirigir al usuario a la página del menú
//   res.redirect("/menu");
// }

// function obtenerAlumnosTxt(req, res) {
//   const alumnos = Modelo.obtenerAlumnos();
//   res.render("/listar", { alumnos: alumnos });
//   res.redirect("/listar");

//   return alumnos;
// }

// module.exports = { getData, nuevo, obtenerAlumnosTxt };
