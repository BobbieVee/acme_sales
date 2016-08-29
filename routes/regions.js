var express = require('express');
var router = express.Router();

router.get('/', function(req,res, next){
	res.render('regions', {title: 'ACME: Regions'})
});


module.exports = router;