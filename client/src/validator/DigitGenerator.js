
export default class DigitGenerator {
    
    getDigitoVerificadorBase11 = (ruc) => {
        return this.getDigitoVerificador(ruc, 11);
    }

    getDigitoVerificador = (ruc, base) => {

        var k = 2;
        var total = 0;
        var valueOfZero = "0".charCodeAt(0);

        var alRevez = this.invertirCadena(this.eliminarNoDigitos(ruc));

        for (var i = 0; i < alRevez.length; i++) {
            var numero = alRevez.charCodeAt(i);
            total += (numero - valueOfZero) * k++;
            if (k > base) k = 2;
        }

        var resto = total % base;
        
        if (resto > 1) return base - resto;
        else return 0;
    }

    invertirCadena = (cadena) => {
        return cadena.split("").reverse().join("");
    }

    eliminarNoDigitos = (ruc) => {
        var toRet = "";
        for (var i = 0; i < ruc.length; i ++) {
            // si no es caracter, lo converitmos a su valor numérico
            if (isNaN(parseInt(ruc[i], 10))) {
                toRet += ruc.charCodeAt(i);
            } else {
                toRet += ruc[i];
            }
        }
        return toRet;
    }
}
