const mongoose = requirer("mongoose");
const Schema = mongoose.Schema;

let mesaSchema = new Schema({
  fechaMesa: Date,
  horaMesa: Number,
  banderaBoo: Boolean,
  mesaEstado: [{
  type: Schema.Types.ObjectId,
  ref: "MesaEstado"
  }],
  alumnoEstado: {
    type: Schema.Types.ObjectId,
    ref: "EstadoAlumno",
  },
});

class Mesa{
    constructor(idMesa, fechaMesa, horaMesa, banderaBool, AlumnoEstado) {
        this.idMesa=idMesa;
        this.fechaMesa=fechaMesa;
        this.horaMesa=horaMesa;
        this.banderaBoo=banderaBoo;
        this.AlumnoEstado=AlumnoEstado;

    }
}
module.exports = mongoose.model("Mesa", mesaSchema);
//module.exports(Mesa);