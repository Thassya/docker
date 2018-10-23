var express = require('express');
var router = express.Router();
var fs = require('fs');
var exec = require('child_process').exec;
var _ = require('underscore');
const EXECUTOR_ERRORS = ["Assertion","Timeout"];

//casos de teste numa tabela separada?
//ESCREVER NO STDIN argumentos de entrada do codigo, quando tiver
//

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
    
    fs.writeFile(`input${d}.c`,codigo, 'utf8', (error)=> {
        if(error) throw error;
        
        exec(`./script.sh ${d}`,(error, stdout, stderr)=>{
            if(error) throw error; 
            if(stderr){
              output.console = criandoConsole(casosTeste, stderr);
              output.result = stderr;
             
            }
            else {
            let rawdata = fs.readFileSync(`stdout${d}.json`);  
            let jsondata = JSON.parse(rawdata);  

            if(!jsondata.output.validacao){
                output.console = criandoConsole(casosTeste, jsondata.output.validacao);
                output.result = jsondata.output.retorno;
                
            }
            else {
                output.console = criandoConsole(casosTeste, jsondata.output.validacao);
                output.result = jsondata.output.validacao;
                
                 }
            }
            
            fs.unlink(`stdout${d}.json`, function(){});
            fs.unlink(`input${d}.c`, function(){});
            res.status(200).json({"output": output});

            return output;      
                        
        });
    });
});

criandoConsole = function(s1, s2){
    var consol = s1.map( function( elem ) {
        var local = elem.match(/\((.*)\)/)[1];
        
        if(s2.includes(local[1])) return false;
        else return true;
    } ); 
    return consol;
}

module.exports = router;