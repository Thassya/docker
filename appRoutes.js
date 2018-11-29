var express = require('express');
var router = express.Router();
var fs = require('fs');
var exec = require('child_process').exec;
var Promise = require('promise');

//middleware que trata codigos não permitidos enviados pelo usuário 

router.post('/tentativa-resposta', (req, res, next) => {
    
    var resposta = req.body.resposta;
    var casosTeste = req.body.avaliador.split('\n');
    var codigo = "";
    let promises = [];

    if (resposta.indexOf('main') > -1 || resposta.indexOf('#include') > -1) {
        let resp = {};
        resp.console = casosTeste.map(e => { return false; });
        resp.result = "SyntaxError: Digite apenas o código pedido, não precisa incluir todo código main (função main(){} ou #includes<>).";

        res.write(JSON.stringify({ "output": resp }));
        res.end();
    }
    else {

        casosTeste.map(teste => {
            var d = new Date().getTime();

            let some_func = () => {
                return new Promise(function (resolve, reject) {
                    codigo = iniciarProgramaEmC() + resposta + teste + "\n}";
                    fs.writeFile(`/tmp/input${d}.c`, codigo, 'utf8', (error) => { if (error) throw error; });

                    exec(`./script.sh ${d}`, (error, stdout, stderr) => {
                        if (error) throw error;
                        let rawdata = fs.readFileSync(`/tmp/stdout${d}.json`);
                        let conteudo = JSON.parse(rawdata);
                        fs.unlink(`/tmp/stdout${d}.json`, function () { });
                        fs.unlink(`/tmp/input${d}.c`, function () { });

                        resolve(conteudo);
                    });
                });
            }
            promises.push(some_func()
                .then((t) => { return t; })
                .catch((c) => { console.log("catch: " + c) }));
        });

        return Promise.all(promises).then(data => {
            let output = {};
            // console.log("First handler", data);
            output.console = data.map(function (elem) {
                if (elem.output.retorno == "") return true;
                else return false;
            });

            output.result = data.reduce(function (oldest, pilot) {
                return (oldest == ("Erro de compilação") || oldest == "Erro de Timeout" || oldest == ("Erro de execução")) ?
                    oldest : pilot.output.compilado == "nao" ?
                        "Erro de compilação" : pilot.output.timeout == "sim " ?
                            "Erro de Timeout" : pilot.output.retorno != "" ? "Erro de execução" : "null";
            }, "null");

            return res.status(200).json({ "output": output });
        });
    }
});


function iniciarProgramaEmC() {
    return "#include <assert.h> \n #include <limits.h> \n #include <math.h> \n #include <stdbool.h> \n #include <stddef.h> \n #include <stdint.h> \n #include <stdio.h> \n #include <stdlib.h> \n #include <string.h> \n int main() { \n ";
}

module.exports = router;
