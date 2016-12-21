var express=require('express');

var app=express();

app.use(express.static('public'));


app.get('/',function(req,res){res.sendFile('index.html');});


var port = process.env.PORT || 8080;

var server=app.listen(port,function(req,res){
    console.log("Catch the action at http://localhost:"+port);
});
