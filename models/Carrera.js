const mongoose = require('mongoose');

const carreraSchema = new mongoose.Schema({
    nombreCarrera: { type: String, required: true },
    titulo: { type: String, required: true },
    cargaHoraria: { type: Number, required: true },
    duracion: { type: Number, required: true },
    planEstudio: { type: mongoose.Schema.Types.ObjectId, ref: 'PlanEstudio' },
    estado: {type: Boolean, default: true}
})

module.exports = mongoose.model("Carrera", carreraSchema);
