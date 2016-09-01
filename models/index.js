var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/acme_sales');

var SalesPersonRegion = db.define('salespersonregion', {});

var SalesPerson = db.define('salesperson', {
	name: {
		type: Sequelize.STRING
	}
}, {
	instanceMethods: {
	
		hasRegion: function(regionId){
			if(!this.salespersonregions)
				throw new Error('use an include for SalesPersonRegion');
			var hasRegion = false;

			this.salespersonregions.forEach(function(salesPersonRegion){
				if(salesPersonRegion.regionId === regionId)
					hasRegion = true;
			});

			return hasRegion;
		}
	}

});


var Region = db.define('region', {
	zip_code: {
		type: Sequelize.STRING
	}
}, {
	instanceMethods: {
		hasSalesPerson: function(salesPersonId){
			if(!this.salespersonregions)
				throw new Error('use an include for SalesPersonRegion');
			var hasSalesPerson = false;

			this.salespersonregions.forEach(function(salesPersonRegion){
				if(salesPersonRegion.salespersonId === salesPersonId)
					hasSalesPerson = true;
			});
			return hasSalesPerson; 
		}
	}
}


);



SalesPerson.hasMany(SalesPersonRegion);
Region.hasMany(SalesPersonRegion);
SalesPersonRegion.belongsTo(Region);
SalesPersonRegion.belongsTo(SalesPerson);

var Seed = function(){
	var names = ['Johnny','Paul', 'Jeff', 'Elizabeth', 'Sally'];
	var zips = ['10530','10531','12345', '45678', '56789'];
	names.forEach(function(name){
		SalesPerson.findOrCreate({where: {name: name}} )
	});
	zips.forEach(function(zip){
		Region.findOrCreate({where: {zip_code: zip}})
	});
	

}

var addSalesPerson2Region = function(salespersonId, regionId) {
	SalesPersonRegion.findOrCreate({where: {salespersonId: salespersonId, regionId: regionId } })
}


module.exports = {
	SalesPerson: SalesPerson,
	Region: Region,
	SalesPersonRegion: SalesPersonRegion, 
	db: db,
	Seed: Seed, 
	addSalesPerson2Region: addSalesPerson2Region
}