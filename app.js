var express=require('express');
const aws = require('aws-sdk');
var db=require('./models/db.js');
var app=express();

var bodyParser=require('body-parser');
var session=require('express-session');

var routes=require('./routes/route.js');
var users=require('./routes/user.js');

app.set('view engine','ejs');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
var session=require('express-session');
app.use(session({secret:"qazwsxedcrfvtgbyhnujm",resave: true, saveUninitialized: true}));

const S3_BUCKET = process.env.S3_BUCKET;

app.get('/',routes.home);
app.get('/gallery',routes.gallery);
app.get('/upload',routes.upload);

app.get('/signup',routes.signup);
app.post('/signup',users.signup);

app.get('/login',routes.login);
app.post('/login',users.login);

app.get('/logout',users.logout);


app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  console.log("File Type "+fileType);
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
      /*url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`*/
      url: 'https://${S3_BUCKET}.s3-us-west-2.amazonaws.com/${fileName}'

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
