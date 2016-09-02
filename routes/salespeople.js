var express = require('express');
var router = express.Router();
var models = require('../models');


router.get('/', function(req,res, next){
	var salesPeople, regions;
	models.SalesPerson.findAll({ 
		include: [  {
          model: models.SalesPersonRegion,
          include: [ models.Region ]
        } ]  })
	.then(function(results){
		salesPeople = results;
		return models.Region.findAll();
	})
	
	.then(function(results){
		regions = results;
		console.log('salesPeople = ', salesPeople); 
		res.render('salespeople', {title:'ACME: Sales People', salesPeople: salesPeople, regions: regions});
		
	})
	

	.catch(next);

	
});

router.post('/:salespersonid/:regionid', function(req, res, next){
	console.log('salespersonid and regionid =', req.params.salespersonid , req.params.regionid)
	models.addSalesPerson2Region(req.params.salespersonid, req.params.regionid)
	.then(function(){
		res.redirect('/salespeople/');
	})
	.catch(next);
})
	

module.exports = router;


