var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );

exports.signup=function(req,res){
   var username=req.body.username;
   var email=req.body.email;
   var password=req.body.password;

   var newuser=new User();
   newuser.username=username;
   newuser.email=email;
   newuser.password=password;

   newuser.save(function(err,savedUser){
       if(err){
         console.log("User already exists with that username or email");
         var message="A user already exists with that username or email";
         res.render("signup",{errorMessage:message});
         return;
       }else{
         req.session.newuser=savedUser.username;
         res.render("login",{session:req.session});
       }
   });
}


exports.login=function(req,res){
    var email=req.body.email;
    var password=req.body.password;

    User.findOne({email:email}, function(err,user){
      console.log("User "+user);
      if(user==null){
        console.log("User is null redirecting to login");
        var message="Invalid email or password";
        console.log("Message :"+message);
        res.render("login",{session:req.session,errorMessage:message});
        return;
      }


     user.comparePassword(password,function(err,isMatch){
       if(isMatch && isMatch==true){
         console.log("Authentication Sucessfull");
         req.session.username=user.username;
         req.session.loggedIn=true;
         console.log("Got User : "+req.session.username);
         res.render("gallery",{session:req.session});
       }else{
         console.log("Authentication UnSucessfull");
         var message="Invalid email or password";
         console.log("Message :"+message);
         res.render("login",{session:req.session,errorMessage:message});
         return;
       }
     });
    });
  }


  exports.logout=function(req,res){
    var loggedOutUser=req.session.username;
    //req.session.destroy();
    req.session.username=null;
    req.session.loggedIn=null;
    req.session.newuser=null;
    console.log("Logged Out :"+loggedOutUser);

    res.render('login',{session:req.session,loggedOutUser:loggedOutUser});
}
