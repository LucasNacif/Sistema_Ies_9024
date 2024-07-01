const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CarreraSchema = new Schema({
    nombreCarrera: String,
    titulo: String,
    cargaHoraria: Number,
    duracion: Number,
    materias: [{
        type: Schema.Types.ObjectId,
        ref:"Materia"
    }],
    plan : [{
        type: Schema.Types.ObjectId,
        ref:"PlanDeEstudio"
    }]
})
class Carrera{
    constructor(idCarrera, nombreCarrera, titulo, cargaHoraria, duracion){
        this.idCarrera=idCarrera;
        this.nombreCarrera=nombreCarrera;
        this.titulo=titulo;
        this.cargaHoraria=cargaHoraria;
        this.duracion=duracion;
    }
}

module.exports = mongoose.model("Carrera", CarreraSchema)