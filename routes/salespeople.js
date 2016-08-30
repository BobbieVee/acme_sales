var express = require('express');
var router = express.Router();
var models = require('../models');


router.get('/', function(req,res, next){
	var salesPeople, regions;
	models.SalesPerson.findAll()
	.then(function(results){
		salesPeople = results;
		return models.Region.findAll();
	})
	.then(function(results){
		regions = results;
		res.render('salespeople', {title: 'ACME: Sales People', salesPeople: salesPeople, regions: regions});
	})
	.catch(next);

	
});

module.exports = router;


