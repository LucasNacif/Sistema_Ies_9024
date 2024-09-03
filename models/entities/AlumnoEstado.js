const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let alumnoEstadoSchema = new Schema({
  idAlumnoEstado: Number,
  fechaInicioCursado: Date,
  fechaFinCursado: Date,
  alumno: {
    type: Schema.Types.ObjectId,
    ref: "Alumno",
    required: true,
  },
});
class AlumnoEstado {
  constructor(idAlumnoEstado, fechaInicioCursado, fechaFinCursado, idAlumno) {
    this.idAlumnoEstado = idAlumnoEstado;
    this.fechaInicioCursado = fechaInicioCursado;
    this.fechaFinCursado = fechaFinCursado;
    this.idAlumno = idAlumno;
  }
}

module.exports = mongoose.model("AlumnoEstado", alumnoEstadoSchema);
