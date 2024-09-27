const mongoose = require('mongoose');

const carreraSchema = new mongoose.Schema({
    nombreCarrera: { type: String, required: true },
    titulo: { type: String, required: true },
    cargaHoraria: { type: Number, required: true },
    duracion: { type: Number, required: true },
    alumnos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alumno' }],
    planEstudio: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PlanEstudio' }] 
}) 

module.exports = mongoose.model("Carrera", carreraSchema);
