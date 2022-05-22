const express = require("express");
const res = require("express/lib/response");
const { render } = require("express/lib/response");
const {ObjectId} = require('mongodb')
const app = express();

const bodyParser = require('body-parser');

const mongoose = require("mongoose");
const { db } = require("./models/account");

//för att skapa en ny instans av en member
const Account = require('./models/account');

const dbURI = 'mongodb://localhost:27017/Bank';
mongoose.connect(dbURI)
.then((result) => app.listen(3000))
.catch((err) => console.log(err))

app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(express.static("scss"));




app.get('/add-account' , (req, res) => {
  res.render('form')
})

app.get("/", (req, res) => {
  res.render("index");
})
app.get("/index", (req, res) => {
  res.render("index");
})

app.get("/accounts", (req, res) => {
  Account.find()
  .then((result) => {
   res.render('accounts', { accounts: result })
  })
  .catch((err) => {
    console.log(err)
  })
})

app.get('/accounts/:id', (req, res) => {
  const id = req.params.id;
  Account.findById(id)
  .then(result => {
    res.render('details', { account: result });
  })
  .catch(err => {
    console.log(err)
  })
})

////////////////////////////////////////////////////
app.get('/deposit/:id', (req, res) => {
  const id = req.params.id;
  Account.findById(id)
  .then(result => {
    res.render('addToAccount', { account: result });
  })
  .catch(err => {
    console.log(err)
  })
})
app.get('/remove/:id', (req, res) => {
  const id = req.params.id;
  Account.findById(id)
  .then(result => {
    res.render('removeFromAccount', { account: result });
  })
  .catch(err => {
    console.log(err)
  })
})


app.patch('/deposit/:id', (req, res) => {
  const id = req.params.id;

  const newNumber = req.body;
  let incomingSum = newNumber.balance;

  let currentSum = db.collection('accounts').findOne({_id: ObjectId(req.params.id)})
  .then(result => add(result))
  .then (res.json({ redirect: '/accounts' }))
 

  function add(current){
    updatedSum = parseInt(incomingSum) + parseInt(current.balance);
    stringifiedSum = JSON.stringify(updatedSum)
    console.log('stringified sum =' + stringifiedSum)
    db.collection('accounts')
    .updateOne({_id: ObjectId(req.params.id)}, {$set:{balance:stringifiedSum}})
  }

})
app.patch('/remove/:id', (req, res) => {
  const id = req.params.id;

  const newNumber = req.body;
  let incomingSum = newNumber.balance;

  let currentSum = db.collection('accounts').findOne({_id: ObjectId(req.params.id)})
  .then(result => remove(result))
  .then (res.json({ redirect: '/accounts' }))
 

  function remove(current){
    updatedSum = parseInt(current.balance) - parseInt(incomingSum);
    if(updatedSum < 0){
      console.log('Du kan inte ta ut mer än vad du har!')
    }
    else{
    stringifiedSum = JSON.stringify(updatedSum)
    console.log('stringified sum =' + stringifiedSum)
    db.collection('accounts')
    .updateOne({_id: ObjectId(req.params.id)}, {$set:{balance:stringifiedSum}})
    }
  }

})
/////////////////////////////////////////////////////7

app.delete('/accounts/:id', (req, res) => {
  const id = req.params.id;
  Account.findByIdAndDelete(id)
  .then(result => {
    res.json({ redirect: '/accounts' })
  })
  .catch(err => {
    console.log(err);
  })
})

app.post('/accounts', (req, res) => {
  const account = new Account(req.body);

  account.save()
  .then((result) => {
    res.redirect('/accounts');
  })
  .catch((err) => {
    console.log(err)
  })
})



app.use((req, res) => {
  res.status(404).render("404");
})