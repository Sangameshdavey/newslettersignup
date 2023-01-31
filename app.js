const express=require('express');
const request=require('request');
const listId="1dc286e174";
const Mailchimp = require('mailchimp-api-v3');
const mailchimp = new Mailchimp('20b2adf82f839bbc71581b73e01bed4c-us21');
const bodyParser = require('body-parser');
const swal = require('sweetalert2');

const app=express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

const addMember = async (email, firstName, lastName,res) => {
  try {
    let result;
    try {
      result = await mailchimp.post(`lists/${listId}/members`, {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      });
    } catch (err) {
      if (err.status === 400 && err.title === 'Member Exists') {
        res.sendFile(__dirname+'/failure.html');
        return;
      } else {
        throw err;
      }
    }

    console.log(result);
    if (result.statusCode === 200) {
      console.log("Member added/updated successfully!");
      res.sendFile(__dirname+'/success.html');
    } else {
      console.log(`Error adding/updating member. Status code: ${result.statusCode}`);
      res.sendFile(__dirname+'/failure.html');
    }
  } catch (err) {
    console.error(err);
    res.sendFile(__dirname+'/failure.html');
  }
};

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
  var fname=req.body.fname;
  var lname=req.body.lname;
  var email=req.body.email;
  console.log(fname+lname+email);

  addMember(email, fname, lname,res);
});

app.listen(3000,function(){
  console.log("listening on port number 3000");
});

app.post("/failure",function(req,res){
  res.redirect("/");
});
