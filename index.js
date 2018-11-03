const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var port = process.env.PORT || 3001;
const cors = require('cors');
var appRoutes = require('./appRoutes');

let server = require('http').Server(app);

app.options('*', cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.get("Origin")||"*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Content-Length, X-Custom-Header,Accept");
    next();
  });

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/server', appRoutes);
app.use('/', express.static('static'));
server.listen(port, function(){
    console.log("App is running on port " + port);
})