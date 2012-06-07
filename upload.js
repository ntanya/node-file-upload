var express = require('express');
var fs = require('fs');  // we will need it for file uploads

var app = module.exports = express.createServer();

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
    
     res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>Image: <input type="file" name="uploadfile" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form>');

});

app.post('/', function(req, res){
     console.log(JSON.stringify(req.files));
     console.log( req.files.uploadfile );
     console.log( req.files.uploadfile.name );
     
     var temp_path = req.files.uploadfile.path;
     var save_path = './public/images/' + req.files.uploadfile.name;
     
     fs.rename(temp_path, save_path, function(error){
     	if(error) throw error;
     	
     	fs.unlink(temp_path, function(){
     		if(error) throw error;
     		res.send("File uploaded to: " + save_path);
     	});
     	
     });        
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
