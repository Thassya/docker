var express = require('express');
var router = express.Router();
var fs = require('fs');
var exec = require('child_process').exec;
// var exec = require('node-exec-promise').exec;

//casos de teste numa tabela separada?
//ESCREVER NO STDIN argumentos de entrada do codigo, quando tiver

function iniciarProgramaEmC(){
    return "#include <assert.h> \n #include <limits.h> \n #include <math.h> \n #include <stdbool.h> \n #include <stddef.h> \n #include <stdint.h> \n #include <stdio.h> \n #include <stdlib.h> \n #include <string.h> \n int main() { \n ";
}

router.post('/tentativa-resposta', (req, res, next)=> {
    let output = {};
    var d = new Date().getTime();
    let resposta = req.body.resposta.split(/\r?\n\n/);
   
    var casosTeste = resposta[1].split(/\r?\n/);
    var codigo = "#include <assert.h> \n #include <string.h> \n" + resposta.shift();

    casosTeste.forEach(elemento => {  
        var lastOf = codigo.lastIndexOf("}"); 
        codigo = codigo.substring(0,lastOf) + "\n" + elemento + "\n"  + codigo.substring(lastOf, codigo.length);
    });

    fs.writeFile(`/tmp/docker/input${d}.c`,codigo, 'utf8', (error)=> { if(error) throw error; });

    exec(`./script.sh ${d}`,(error, stdout, stderr)=>{
        if(error) throw error; 
        let rawdata = fs.readFileSync(`/tmp/docker/stdout${d}.json`);  
        let jsondata = JSON.parse(rawdata); 
        
        if(jsondata.output.compilado=="nao"){
            output.console = {}, output.result = "Erro de compilação";
        }
        else if(jsondata.output.compilado=="sim"&&jsondata.output.validacao==" "&&jsondata.output.retorno==""){
            //deu tudo certo
            output.console = {}, output.result = null;
        }
        else {
            output.console = criandoConsole(casosTeste, jsondata.output.retorno);
            output.result = jsondata.output.validacao;
        }
        fs.unlink(`/tmp/docker/stdout${d}.json`, function(){});
        fs.unlink(`/tmp/docker/input${d}.c`, function(){});
        return res.status(200).json({"output": output});
    });
});

criandoConsole = function(arrayErros, arrayResult){
    var consol = arrayErros.map( function( elem ) {
        var local = elem.match(/\((.*)\)/);
            if(arrayResult.indexOf(local[1]) > -1 ) { 
                return false;
            }
            else return true;        
    }); 
    return consol;
}

module.exports = router;