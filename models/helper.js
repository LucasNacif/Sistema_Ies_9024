//////////////////// Generador de ID ////////////////////
function getUuid(longitud = 20) {
    const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var resultado = [];

    for (var i = 0; i < longitud; i++) {
        //Obtencion de un entero multiplicado random por Alfabeto
        resultado.push(ALFABETO.charAt(Math.floor(Math.random() * ALFABETO.length)));
    }

    return resultado.join('');
}

module.exports = {getUuid};