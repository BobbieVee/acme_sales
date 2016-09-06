var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/', function(req,res, next){
	console.log('regionid**********  =', req.params.regionid)
	var salesPeople, regions;
	models.SalesPerson.findAll()
	.then(function(results){
		salesPeople = results;
		return models.Region.findAll({ 
			include: [  {
	          model: models.SalesPersonRegion,
	          include: [ models.SalesPerson ]
	        } ]  }
		)
	})

	.then(function(results){
		regions = results;
		res.render('regions', {title: 'ACME: Regions', salesPeople: salesPeople, regions: regions});
	})
	.catch(next);
});

router.post('/', function(req,res,next){
	var zipcode = req.body.zipcode
	models.Region.findOrCreate({where: {zip_code: zipcode}})
	.then(function(region){
		console.log(region[0].id)
		res.redirect('/regions/#' + region[0].id) 
	})
	.catch(next);	
})


router.post('/:salespersonid/:regionid', function(req, res, next){
	var regionId = req.params.regionid;
	models.addSalesPerson2Region(req.params.salespersonid, regionId )
	.then(function(){
		res.redirect('/regions/#' + regionId);
	})
	.catch(next);
})

router.delete('/:regionid', function(req,res,next){
	var regionid = req.params.regionid;
	models.removeSalesPersonFromRegion(0, regionid)
	.then(function(){
		return models.Region.destroy({where: {id: regionid}})
	})
	
	.then(function(){
		console.log('removed region with id =', regionid);
		regionid = regionid*1;
		res.redirect('/regions/#' + (regionid-1))
	})
	.catch(next);
})

router.delete('/:regionid/:salespersonid', function(req, res, next){
	var regionId = req.params.regionid;
	models.removeSalesPersonFromRegion(req.params.salespersonid , regionId )
	.then(function(){
		res.redirect('/regions/#' + regionId);
	})
})




module.exports = router;