var express = require('express');
var router = express.Router();
var models = require('../db').models;


router.get('/', function(req,res, next){
  //like regions-- these can be run independently - use Promise.all and then spread
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
  //don't use findOrCreate-- there is no rule that you can't have two sales people with the same name, right?
	models.SalesPerson.findOrCreate({where: {name: req.body.name}} )
	.then(function(salesperson){
		res.redirect('/salespeople/#'+ salesperson[0].id);
	})
	.catch(next);
});

//just call this id... 
router.delete('/:id', function(req,res,next){
  models.SalesPersonRegion.destroy({
    where: { salesPersonId: req.params.id }
  })
  .then(function(){
    return models.SalesPerson.destroy({
      where: { id: req.params.id }
    });
  })
	.then(function(){
		console.log('removed salesperson with id =', req.params.id);
		res.redirect('/salespeople/#' + (req.params.id*1 - 1))
	})
	.catch(next);
});

//camel case these params
router.post('/:salespersonid/:regionid', function(req, res, next){
  models.SalesPersonRegion.create({
    salesPersonId: req.params.salesPersonId,
    regionId: req.params.regionId
  })
	.then(function(){
		res.redirect('/salespeople/#' + req.params.salesPersonId);
	})
	.catch(next);
});

router.delete('/:salespersonid/:regionid', function(req, res, next){
  //see above-- just delete from the SalesPersonRegion
	var salespersonid = req.params.salespersonid; 
	models.removeSalesPersonFromRegion(salespersonid , req.params.regionid)
	.then(function(){
		res.redirect('/salespeople/#' + salespersonid);
	})
})


	

module.exports = router;


