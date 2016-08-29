var express = require('express');
var router = express.Router();

router.use('/', function(req,res, next){
	res.render('salespeople', {title: 'ACME: Sales People'})
});

module.exports = router;


