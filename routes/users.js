var express = require('express');
var router = express.Router();
//db connection
var mongo = require("mongodb");
var dbhost = "127.0.0.1",
    dbport = 27017;

var db=new mongo.Db("BankDB", new mongo.Server(dbhost,dbport, {}));
//customer signup
router.post('/signup',function(req,res){
  db.open(function (error) {
    if (error){
      console.log("Unable to connect to DB" +error);
    }
    else{
      db.collection("customers", function (error, collection) {
        if (error){
          console.log("Unable to insert to DB" +error);
        }
        else if (collection){
          var num = Math.floor(Math.random()*1000);
          var user= req.query.customername;
          collection.insert({
            CustomerName: user,
            SSN: req.query.ssn,
            MobileNo: req.query.mobile,
            EmailId: req.query.emailid,
            Address: req.query.address,
            Password: req.query.password,
            AccountNo: num.toString()
          });
          collection.find({'CustomerName': user}).nextObject(function(error, result) {
            if(error){
              console.log("Unable to find DB query" +error);
            }
            else if (result){
              res.json(result);
            }
            else{
              res.send("Failure");
            }
          });
        }
        else {
          res.send("Failure");
        }

      });
    }
  });
});
//customer signin
router.post('/signin',function(req,res){
  var userid= req.query.userid;
  var pwd =req.query.pwd;
  db.open(function (error) {
    if (error){
      console.log("Unable to connect to DB" +error);
    }
    else{
      db.collection('customers',function (error, collection) {
        collection.find({'EmailId':userid,'Password':pwd}).nextObject(function(error, result) {
          if(error){
            console.log("Unable to find DB query" +error);
          }
          else if (result){
            res.send("Success Signin \r\n CustomerName: " +result.CustomerName + "\r\n AccountNo: " +result.AccountNo);
          }
          else{
            res.send("Failure");
          }
        });
      });
    }
  });
});
//Adding deposit
router.post('/deposit',function(req,res){
  var userid= req.query.userid;
  var pwd =req.query.pwd;
  var amount = req.query.amount;
  db.open(function (error) {
    if (error){
      console.log("Unable to Open DB" +error);
    }
    else{
      db.collection('customers',function (error, collection) {
         collection.update({'EmailId':userid,'Password':pwd},{$set:{"Amount":amount}},function(error, result) {
           if(error){
             console.log("Unable to Update" +error);
           }
           else if (result) {
             res.send("Success" +result.Amount);
           }
           else{
            res.send("Failure");
           }
         });
      });
    }
  });
});

router.get('/balance', function(req, res,next) {
  var account = req.query.account;
  console.log(account);
  db.open(function (error) {
    if (error){
      console.log("Unable to open the DB" +error);
    }
    else{
      db.collection('customers',function (error, collection) {
        collection.find({'AccountNo': account}).nextObject(function(error, result) {
          if(error){
            console.log("Unable to find the query" +error);
          }
          else if(result){
            //res.json(result);
           res.send("AccountNo :" +result.AccountNo+ "\r\n Balance: " +result.Amount);
          }
          else{
            res.send("Failure");
          }
        });
      });
    }
  });
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Banking Application');
});

module.exports = router;
