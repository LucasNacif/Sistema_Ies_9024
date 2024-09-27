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

module.exports = mongoose.model("AlumnoEstado",alumnoEstadoSchema);