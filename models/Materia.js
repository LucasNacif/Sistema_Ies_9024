const mongoose = require('mongoose');

const MateriaSchema = new mongoose.Schema({
    nombreMateria: { type: String, required: true },
    correlativas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Materia' }]
});

module.exports = mongoose.model('Materia', MateriaSchema);
