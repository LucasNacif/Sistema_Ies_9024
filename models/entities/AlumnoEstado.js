const mongoose = requirer("mongoose");
const Schema = mongoose.Schema;

let alumnoEstadoSchema= new Schema ({
    fechaFinCursado: Date,
    fechaFinCursado: Date,
    alumno: {
        type: Schema.Types.ObjectId,
        ref: "Alumno",
      },
    estadoAlumno: [{
        type: Schema.Types.ObjectId,
        ref: "EstadoAlumno",
    }],
});
class AlumnoEstado {
    constructor(idAlumnoEstado, fechaInicioCursado, fechaFinCursado, idAlumno){
        this.idAlumnoEstado=idAlumnoEstado;
        this.fechaInicioCursado=fechaInicioCursado;
        this.fechaFinCursado=fechaFinCursado;
        this.idAlumno=idAlumno;
    }
}

module.exports = mongoose.model("AlumnoEstado",alumnoEstadoSchema);