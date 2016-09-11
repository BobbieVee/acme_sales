var server = require('http').createServer(require('./app'));

if(process.env.SYNC){
  require('./db').sync()
    .then(function(){
      console.log('synched');
    })
    .catch(function(err){
      console.log(err);
    });
}

var port = process.env.PORT;
server.listen(port, function(){
  console.log('server listening on port ' + port);
});
