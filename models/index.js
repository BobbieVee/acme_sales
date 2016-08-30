var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/acme_sales');

var SalesPerson = db.define('salesperson', {
	name: {
		type: Sequelize.STRING
	},


});

var Region = db.define('region', {
	zip_code: {
		type: Sequelize.STRING
	}
});

var SalesPersonRegion = db.define('salespersonregion', {});

SalesPerson.hasMany(SalesPersonRegion);
Region.hasMany(SalesPersonRegion);
SalesPersonRegion.belongsTo(Region);
SalesPersonRegion.belongsTo(SalesPerson);

var Seed = function(){
	var names = ['Paul', 'Jeff', 'Elizabeth', 'Sally'];
	var zips = ['10531','12345', '45678', '56789'];
	names.forEach(function(name){
		SalesPerson.findOrCreate({where: {name: name}} )
	});
	zips.forEach(function(zip){
		Region.findOrCreate({where: {zip_code: zip}})
	});
}


module.exports = {
	SalesPerson: SalesPerson,
	Region: Region,
	SalesPersonRegion: SalesPersonRegion, 
	db: db,
	Seed: Seed
}