const mongoose = requirer("mongoose");
const Schema = mongoose.Schema;

let estadoAlumnoSchema = new Schema({
  profesorTitular: String,
  estadoActual: Number,
  mesa: [{
    type: Schema.Types.ObjectId,
    ref: "Mesa",
  }],
  materia: {
    type: Schema.Types.ObjectId,
    ref: "Materia",
  },
  alumnoEstado: {
    type: Schema.Types.ObjectId,
    ref: "AlumnoEstado"
  }
});

class EstadoAlumno {
  constructor(idEstadoALumno, profesorTitular, estadoActual, idAlumno, idMateria) {
    this.idEstadoALumno = idEstadoALumno;
    this.profesorTitular = profesorTitular;
    this.estadoActual = estadoActual;
    this.idAlumno = idAlumno;
    this.idMateria = idMateria;
  }
}
//module.exports(EstadoAlumno);
module.exports = mongoose.model("EstadoAlumno", estadoAlumnoSchema);