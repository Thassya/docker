var express = require('express');
var router = express.Router();
var fs = require('fs');
var exec = require('child_process').exec;
var execp = require('node-exec-promise').exec;

//casos de teste numa tabela separada?
//ESCREVER NO STDIN argumentos de entrada do codigo, quando tiver

// function iniciarProgramaEmC() {
//     return "#include <assert.h> \n #include <limits.h> \n #include <math.h> \n #include <stdbool.h> \n #include <stddef.h> \n #include <stdint.h> \n #include <stdio.h> \n #include <stdlib.h> \n #include <string.h> \n int main() { \n ";
// }

// router.post('/tentativa-resposta', (req, res, next) => {
//     let output = {};
//     var d = new Date().getTime();
//     let resposta = req.body.resposta.split(/\r?\n\n/);

//     var codigoInicial = iniciarProgramaEmC() + resposta[0];
//     var casosTeste = resposta[1].split(/\r?\n/);
//     var codigoASerEnviado = "";

//     var respostaCasosTeste = [];

//     Promise.all(criaArquivo(casosTeste, codigoInicial, `${d}`))
//         .then(data => {
//             console.log("First handler", data);
//             return data.map(entry => compilarArquivo(entry));
//         })
//         .then(data => {
//             console.log("Second handler", data);
//         });
// });



// function criaArquivo(casosTeste, codigoInicial, d) {
//     var nomes = [];
//     return new Promise((resolve, reject) => {
//         for (var i = 0; i < casosTeste.length; i++) {
//             var codigoASerEnviado = codigoInicial + "\n" + casosTeste[i] + "\n\n}";

//             fs.writeFile(`/tmp/docker/input${d}-${i}.c`, codigoASerEnviado, 'utf8', (error) => { if (error) return reject(error); });
//             nomes[i]= `${d}-${i}`;
//         }
//         return resolve(nomes);
//     })
// }

// function compilarArquivo(nomeArquivo) {
//     var resposta = {};
//     // var houveErro = false;

//     return new Promise((resolve, reject) => {
//         exec(`./script.sh ${nomeArquivo}`, (error, stdout, stderr) => {
//             if (error) return reject(error);
//             let jsondata = JSON.parse(fs.readFileSync(`/tmp/docker/stdout${nomeArquivo}.json`));

//             resposta.indice = 0;
//             if (jsondata.output.retorno == "") {
//                 resposta.retorno = true;
//                 resposta.result = "null"
//             }
//             else {
//                 resposta.retorno = false;
//                 resposta.result = "Há erros de compilação"
//             }
//             fs.unlink(`/tmp/docker/stdout${nomeArquivo}.json`, function () { });
//             fs.unlink(`/tmp/docker/input${nomeArquivo}.c`, function () { });
//         });
//         return resolve(resposta);
//     });
// };

// function chamaDocker(parametro) {
//     return new Promise((response, reject) => {

//         exec(`./script.sh ${d}-${i}`, (error, stdout, stderr) => {
//             if (error) return reject(error);
//             let jsondata = JSON.parse(fs.readFileSync(`/tmp/docker/stdout${d}-${i}.json`));

//             resposta.indice = i;
//             if (jsondata.output.retorno == "") {
//                 resposta.retorno = true;
//                 resposta.result = "null"
//             }
//             else {
//                 resposta.retorno = false;
//                 resposta.result = "Há erros de compilação"
//             }
//             fs.unlink(`/tmp/docker/stdout${d}-${i}.json`, function () { });
//             fs.unlink(`/tmp/docker/input${d}-${i}.c`, function () { });
//         });
//     });
// }




router.post('/tentativa-resposta', (req, res, next) => {
    let output = {};
    var d = new Date().getTime();
    let resposta = req.body.resposta.split(/\r?\n\n/);

    var casosTeste = resposta[1].split(/\r?\n/);
    var codigo = "#include <assert.h> \n #include <string.h> \n" + resposta.shift();

    casosTeste.forEach(elemento => {
        var lastOf = codigo.lastIndexOf("}");
        codigo = codigo.substring(0, lastOf) + "\n" + elemento + "\n" + codigo.substring(lastOf, codigo.length);
    });

    fs.writeFile(`/tmp/docker/input${d}.c`, codigo, 'utf8', (error) => { if (error) throw error; });

    exec(`./script.sh ${d}`, (error, stdout, stderr) => {
        if (error) throw error;
        let rawdata = fs.readFileSync(`/tmp/docker/stdout${d}.json`);
        let jsondata = JSON.parse(rawdata);

        if (jsondata.output.compilado == "nao") {
            output.console = {}, output.result = "Erro de compilação";
        }
        else if (jsondata.output.compilado == "sim" && jsondata.output.validacao == " " && jsondata.output.retorno == "") {
            //deu tudo certo
            output.result = "null";
        }
        else {
            // output.console = criandoConsole(casosTeste, jsondata.output.retorno);
            output.result = jsondata.output.validacao;
        }
        output.console = criandoConsole(casosTeste, jsondata.output.retorno);

        fs.unlink(`/tmp/docker/stdout${d}.json`, function () { });
        fs.unlink(`/tmp/docker/input${d}.c`, function () { });
        return res.status(200).json({ "output": output });
    });
});

criandoConsole = function (arrayErros, arrayResult) {
    var consol = arrayErros.map(function (elem) {
        var local = elem.match(/\((.*)\)/);
        if (arrayResult.indexOf(local[1]) > -1) {
            return false;
        }
        else return true;
    });
    return consol;
}

module.exports = router;

//// CODIGO UTILIZANDO O EXEC PROMISSE... N DEU CERTO NA HORA DE ENVIAR A MENSAGEM DE VOLTA... CONSTRUIR A RESPOSTA COMO O APP EXIGE.APENAS ISSO... A ORDEM DE EXECUCAO FUNCIONA E O RESULTADO DOS TESTES SAO RETORNADOS EM ORDEM


// router.post('/tentativa-resposta', (req, res, next) => {
//     let output = {};
//     var d = new Date().getTime();
//     let resposta = req.body.resposta.split(/\r?\n\n/);

//     var casosTeste = resposta[1].split(/\r?\n/);
//     var codigo = iniciarProgramaEmC() + resposta[0];

//     var codigoEnviado = "";
//     var resConsole = [];
//     var houveErroValidacao = false; 

//     for (var i = 0; i < casosTeste.length; i++) {
//         //cria o codigo com apenas um caso de teste;
//         codigoEnviado = codigo + "\n" + casosTeste[i] + "\n\n}";
//         resConsole[i] = "";

//         //cria o arquivo, grava o codigo nele e retorna o indice que foi salvo;
//         execp(`echo "${" "}" > /tmp/docker/input${d}-${i}.c && printf "${codigoEnviado}" > /tmp/docker/input${d}-${i}.c && echo ${i}`).then(function (out) {
//             var num = out.stdout.trim();

//             //executa o script.sh que compila o codigo num container e retorna o resultado num json.
//             execp(`./script.sh ${d}-${num}`).then(function (out) {
//                 // console.log(out.stdout, out.stderr);
//                 let jsondata =  JSON.parse(fs.readFileSync(`/tmp/docker/stdout${d}-${num}.json`));

//                 jsondata.output.retorno == "" ? resConsole[num]=true : resConsole[num]=false, houveErroValidacao = true;
//                  console.log(jsondata);

//             }, function (err) { console.error(err) });

//             houveErroValidacao ? output.result = "Seu código não passou nos casos de teste" : output.result = "null";
//             output.console = JSON.stringify(resConsole); 

//             //    fs.unlink(`/tmp/docker/input${d}-${num}.c`, function(){});
//             //    fs.unlink(`/tmp/docker/stdout${d}-${num}.json`, function(){});
//         }, function (err) { console.error(err); });
//     }
// });