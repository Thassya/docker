const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var fs = require('fs');
var exec = require('child_process').exec;

const app = express();
app.use(bodyParser.json());

app.listen(8000, ()=> {
    console.log('Servidor iniciado em: http://localhost:8000');
});


app.route('/api/codigo').post((req,res)=> { 
    var d = new Date().getTime();

    let codigo = req.body.codigo;

    fs.writeFile(`input${d}.c`,codigo, 'utf8', (error)=> {
        if(error) throw error;
        
        exec(`./script.sh ${d}`,(error, stdout, stderr)=>{
            if(!error) {
                var msg = '';
                let retorno = {};
                retorno.condigo = codigo;

                fs.readFile(`status${d}.txt`, function (err, data) {
                    if (err) throw err;
                    msg += data.toString();
                    msg += '\n';
                    retorno.status = data.toString();

                });

                fs.readFile(`output${d}.txt`, function (err, data) {
                    if (err) throw err;                   
                    msg += data.toString();
                    msg += '\n';

                    retorno.output = data.toString();
                });

                fs.readFile(`error${d}.txt`, function (err, data) {
                    if (err) throw err;
                     msg += data.toString();
                     msg += '\n';

                    retorno.erros = data.toString();
                    res.send(retorno);
                    fs.unlink(`status${d}.txt`, function(){});
                    fs.unlink(`output${d}.txt`, function(){});
                    fs.unlink(`error${d}.txt`, function(){});
                    fs.unlink(`input${d}.c`, function(){});
                });

                // fs.unlink(`status${d}.txt`);
                // fs.unlink(`output${d}.txt`);
                // fs.unlink(`error${d}.txt`);
                // fs.unlink(`input${d}.c`);

               
 
               
            }
        }); 
    });

    

});
