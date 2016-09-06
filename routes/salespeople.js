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
		res.render('salespeople', {title:'ACME: Sales People', salesPeople: salesPeople, regions: regions});
	})
	.catch(next);
});

router.post('/',function(req,res,next){
	var name = req.body.name;
	models.SalesPerson.findOrCreate({where: {name: req.body.name}} )
	.then(function(salesperson){
		console.log('Here is the salesperson id: ', salesperson[0].id)
		res.redirect('/salespeople/#'+ salesperson[0].id)
	})
	.catch(next);
});

router.delete('/:salesid', function(req,res,next){
	var salesid = req.params.salesid;
	models.removeSalesPersonFromRegion(salesid, 0)
	.then(function(){
		return models.SalesPerson.destroy({where: {id: salesid}})
	})
	
	.then(function(){
		console.log('removed salesperson with id =', salesid);
		salesid = salesid*1;
		res.redirect('/salespeople/#' + (salesid-1))
	})
	.catch(next);
})

router.post('/:salespersonid/:regionid', function(req, res, next){
	var salespersonid = req.params.salespersonid; 
	models.addSalesPerson2Region(salespersonid, req.params.regionid)
	.then(function(){
		res.redirect('/salespeople/#' + salespersonid);
	})
	.catch(next);
});

router.delete('/:salespersonid/:regionid', function(req, res, next){
	var salespersonid = req.params.salespersonid; 
	models.removeSalesPersonFromRegion(salespersonid , req.params.regionid)
	.then(function(){
		res.redirect('/salespeople/#' + salespersonid);
	})
})


	

module.exports = router;


