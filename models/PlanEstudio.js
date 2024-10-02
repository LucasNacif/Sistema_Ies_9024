const mongoose = require('mongoose');

const PlanEstudioSchema = new mongoose.Schema({
    materias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Materia' }],
    alumnos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Alumno' }],
    nombre: { type: String, required: true },
    fechaAlta: { type: Date, default: Date.now },
    fechaBaja: { type: Date }
});

module.exports = mongoose.model('PlanEstudio', PlanEstudioSchema);
