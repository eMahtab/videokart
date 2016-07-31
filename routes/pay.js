var mongoose = require( 'mongoose' );
var Order = mongoose.model( 'Order' );

var aws = require('aws-sdk');

var ses = new aws.SES({"accessKeyId": process.env.AWS_ACCESS_KEY_ID,
  "secretAccessKey": process.env.AWS_SECRET_ACCESS_KEY,
  "region": process.env.REGION ,apiVersion: '2010-12-01'});

exports.paymentSuccess=function(req,res){
   var username=req.session.username;
   var videoType=req.session.type;
   console.log("File uploaded was "+req.session.fileName);
   var order=new Order();
   order.username=username;
   order.videoType=videoType;
   order.fileName=req.session.fileName;

   order.save(function(err,savedOrder){
       if(err){
         console.log("Error : Problem Saving Orders");
         return;
       }else{

        //Sending EMail

         var to = ['alammahtab08@gmail.com']
         var from = 'alammahtab08@gmail.com'
         var filename=req.session.fileName;
         var encodedFilename=filename;
         for(var i=0;i<filename.length;i++){
           encodedFilename=encodedFilename.replace(" ","+");
         }
         var fileURL='https://s3-us-west-2.amazonaws.com/videokart/'+encodedFilename;
         //console.log("Filename for eMail "+req.session.fileName);
         console.log("Email Data "+req.session.type+" $ "+fileURL )
         var messageSubject='Videokart New Task - '+req.session.type;
         var messageBody='Hey buddy, you have some task to do, download the files from '+fileURL+
                         ' and once done send the finished video to '+req.session.userEmail;
         ses.sendEmail(
         	{
         		Source: from,
         		Destination: { ToAddresses: to },
         		Message: {
         			Subject: {Data: messageSubject},
         			Body: {			Text: {	Data: messageBody}       			}
         		}
         	}
         , function(err, data) {
         	if(err) throw err
         	console.log('Email sent:');
         	console.log(data);
         });
         res.render("paymentSuccess",{session:req.session});
       }
   });
}

exports.paymentError=function(req,res){
         //callIt();
         res.render("paymentError",{session:req.session});

}
