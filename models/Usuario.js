const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
    dni: { type: String, required: true, unique: true },
    email: { type: String },
    nombre: { type: String },
    password: { type: String, required: true },
    rol: { type: String, enum: ['alumno', 'bedel', 'superAdmin'], required: true },
    fechaRegistro: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Usuario", UsuarioSchema);