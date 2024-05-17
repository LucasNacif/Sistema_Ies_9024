const Helper = require('./helper.js');
const Modelo = require('./modelo.js')

function registrado(body){
    console.log("seguridad --> modelo 'getUsuarios()'")
    let usuarios = Modelo.getUsuarios()
    console.log("seguridad <-r- modelo '[{Usuario}]'")
    if(body.pass != ''){
        
        let cant = usuarios.filter(x=> body.user == x.usuario && x.pass == x.pass)
        if(cant.length == 1){
            return true;
        }else{
            return false;
        }
    }else{
        return false
    }
    
}

module.exports = {registrado};