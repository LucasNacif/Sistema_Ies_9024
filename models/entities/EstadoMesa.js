
const mongoose = requirer("mongoose");
const Schema = mongoose.Schema;

let estadoMesaSchema = new Schema({
  estado: String,
  mesaEstado: [{
    type: Schema.Types.ObjectId,
    ref:"MesaEstado"
  }] 
});

class EstadoMesa{
    constructor(idEstadoMesa, estado){
        this.idEstadoMesa= idEstadoMesa;
        this.estado= estado;
    }
}
//module.exports(EstadoMesa)
module.exports = mongoose.model("EstadoMesa", estadoMesaSchema);