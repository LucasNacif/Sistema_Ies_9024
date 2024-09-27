const mongoose = require('mongoose');
const CursoSchema = new mongoose.Schema({
    nombreCurso: { type: String, required: true },
    materias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Materia' }]
});

module.exports = mongoose.model('Curso', CursoSchema);
