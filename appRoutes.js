var express = require('express');
var router = express.Router();
var fs = require('fs');
var exec = require('child_process').exec;

router.post('/tentativa', (req,res,next)=>{
    var d = new Date().getTime();
    let codigoParaCompilar = req.body.resposta;

    fs.writeFile(`/tmp/input${d}.c`, codigoParaCompilar, 'utf8', (error) => { if (error) throw error; });

    exec(`./script.sh ${d}`, (error, stdout, stderr) => {
        if (error) throw error;        
        let rawdata = fs.readFileSync(`/tmp/stdout${d}.json`);
        let conteudo = JSON.parse(rawdata); 
        fs.unlink(`/tmp/stdout${d}.json`, function () { });
        fs.unlink(`/tmp/input${d}.c`, function () { });
        return res.status(200).json({ conteudo });
    });
});

module.exports = router;
