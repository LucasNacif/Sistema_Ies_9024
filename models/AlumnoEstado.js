const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlumnoEstadoSchema = new Schema({
    idAlumno: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumno' },
    idMateria: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia' },
    estadoActual: { type: String, enum: ['regular', 'libre', 'acreditado', 'desaprobado'], default: 'regular' },
    fecha: { type: Date, default: Date.now },
});
module.exports = mongoose.model("alumnoEstado", AlumnoEstadoSchema);