const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlumnoEstadoSchema = new Schema({
    idAlumno: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumno' },
    idMateria: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia' },
   // estadoActual: {type: String, enum:['regular', 'libre', 'acreditado', 'sin estado'], required: true},
    //cada vez que guardas un nuevo estado, se agrega el historial y se actualiza estadoActual con el ultimo estado que guardaste
    historialEstados: [
        {
            estado: { type: String, enum: ['regular', 'libre', 'acreditado', 'sin estado'], required: true },
            fecha: { type: Date, default: Date.now }
        }
    ]
});
module.exports = mongoose.model("alumnoEstado", AlumnoEstadoSchema);