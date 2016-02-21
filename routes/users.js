var express = require('express');
var router = express.Router();
//db connection
var mongo = require("mongodb");
var dbhost = "127.0.0.1",
    dbport = 27017;

var db=new mongo.Db("bank-customer", new mongo.Server(dbhost,dbport, {}));

router.post('/acc',function(req,res){
  db.open(function (error) {
    //console.log("We are connected to db now");
    db.collection("customers", function (error, collection) {
      var num = Math.floor(Math.random()*1000);
      collection.insert({
        CustomerName: req.query.customername,
        SSN: req.query.ssn,
        MobileNo: req.query.mobile,
        EmailId: req.query.emailid,
        Address: req.query.address,
        Password: req.query.password,
        AccountNo: num.toString()
      });
      res.send('success' +collection);
    });
  });
});
router.post('/signin',function(req,res){
  var userid= req.query.userid;
  var pwd =req.query.pwd;
  db.open(function (error) {
    db.collection('customers',function (error, collection) {
      collection.find({'EmailId':userid,'Password':pwd}).nextObject(function(error, result) {
        if(error){
          res.send('failure');
        }
        else {
          res.send("Success \r\n CustomerName: " +result.CustomerName + "\r\n AccountNo: " +result.AccountNo);
        }
      });
    });
  });
});

router.post('/amount',function(req,res){
  var userid= req.query.userid;
  var pwd =req.query.pwd;
  var amount = req.query.amount;
  db.open(function (error) {
    db.collection('customers',function (error, collection) {
      collection.update({'EmailId':userid,'Password':pwd},{$set:{"Amount":amount}},function(error, result) {
        if(error){
          res.send('failure');
        }
        else {
          res.send("Success" +result.Amount);
        }
      });
    });
  });
});

router.get('/balance', function(req, res,next) {
  var account = req.query.account;
  console.log(account);
  db.open(function (error) {
    db.collection('customers',function (error, collection) {
      collection.find({'AccountNo': account}).nextObject(function(error, result) {
        if(error){
          res.send('failure');
        }
        else {
          console.log(result);
          res.send("AccountNo :" +result.AccountNo+ "\r\n Balance: " +result.Amount);
        }
      });
    });
  });
  //res.send('respond with a resource');
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
