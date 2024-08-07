const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let mesaEstadoSchema = new Schema({
  fechaInicio: Date,
  horaInicio: Number,
  mesa: {
    type: Schema.Types.ObjectId,
    ref: "Mesa",
  },
  estadoMesa: {
    type: Schema.Types.ObjectId,
    ref: "EstadoMesa",
  },
});

class MesaEstado{
    constructor(idMesaEstado, fechaInicio, horaInicio, idMesa, idEstadoMesa) {
        this.idMesaEstado=idMesaEstado;
        this.fechaInicio=fechaInicio;
        this.horaInicio=horaInicio;
        this.idMesa=idMesa;
        this.idEstadoMesa=idEstadoMesa;
    }
}
//module.exports(MesaEstado);
module.exports = mongoose.model("MesaEstado", mesaEstadoSchema);