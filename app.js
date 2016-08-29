
var express = require('express');
var app = express();
var swig = require('swig');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var path = require('path');
// var models = require('./models');


app.use(express.static(__dirname + '/node_modules'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.set('views', __dirname + '/views');
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
swig.setDefaults({cache: false});

app.use('/salespeople', require('./routes/salespeople'));
app.use('/regions', require('./routes/regions'));

app.get('/', function(req,res){
	res.render('index', {title: 'ACME Sales'})
});

app.listen(3000, function(){
	console.log('Hombre, server is Listening on port 3000!')
})

