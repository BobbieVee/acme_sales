
var express = require('express');
var app = express();
var swig = require('swig');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var path = require('path');
var models = require('./models');


app.use(express.static(__dirname + '/node_modules'));
app.use('/public', express.static(__dirname + '/public'))
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

// var forceOrNot = 'force: true';
var forceOrNot  = '';

models.Region.sync({forceOrNot })
.then(function(){
	models.SalesPerson.sync({forceOrNot })
})
.then(function(){
	models.SalesPersonRegion.sync({forceOrNot })
})
.then(function(){
	app.listen(3000, function(){
		console.log('Hombre, server is Listening on port 3000!')
	});
	
}) 
.catch(console.error);


// models.Seed();







