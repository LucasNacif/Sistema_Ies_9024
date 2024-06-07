const Clases = require('./clases.js');
const Helper = require('./helper.js');
const Modelo = require('./modelo.js');

function testPerfil() {
    console.log("Perfil ------------------");
    const perfil = new Clases.Perfil();
    perfil.addCasoUso("cu00");
    console.log(perfil);
    perfil.addCasoUso("cu01");
    console.log(perfil);
    perfil.delCasoUso("cu00");
    console.log(perfil);
    return perfil
}

function tetsUsuario() {
    console.log("Usuario --------------------")
    const unUsuario = new Clases.Usuario("Enzo Perez","enzito","1234",Helper.getUuid(),testPerfil());
    console.log(unUsuario);
    let str_unUsuario = JSON.stringify(unUsuario);
    console.log(str_unUsuario);
    let par_unUsuario = JSON.parse(str_unUsuario);
    console.log(par_unUsuario);
    let obj_unUsuario = Clases.Usuario.fromJSON(par_unUsuario);
    console.log(obj_unUsuario);
}

//Modelo.guardarUsuario(unUsuario);

//console.log("getUsuarios ---------------------")
//console.log(Modelo.getUsuarios());

