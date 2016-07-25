var express=require('express');
const aws = require('aws-sdk');
var app=express();

var routes=require('./routes/route.js');

app.set('view engine','ejs');

app.use(express.static(__dirname + '/public'));

const S3_BUCKET = process.env.S3_BUCKET;

app.get('/',routes.home);
app.get('/gallery',routes.gallery);
app.get('/upload',routes.upload);

app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});




var port = process.env.PORT || 8080;

//var port = process.env.PORT || 7000;

var server=app.listen(port,function(req,res){
    console.log("Catch the action at http://localhost:"+port);
});
