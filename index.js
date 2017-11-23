const express = require('express');
const app = express();
const path = require('path');
const fileIO = require('./utils/fileIO');
const bodyParser = require('body-parser')
const Validator = require('jsonschema').Validator;
const deckSchema = require('./models/deck')

var v = new Validator();
v.addSchema(deckSchema.cardSchema, '/Card');
const deck = {"id":29384};
console.log(v.validate(deck,deckSchema.deckSchema));

const deckPath = path.join(__dirname, 'decks'); 
app.use(bodyParser.json());


app.get('/test', function(req, res) {
  
  const jsonResponse = {'test-data': [1,2,3,4,5,6,7,8,9], 'inner-array':['a','b','c','d']} ;

  res.json(jsonResponse);
});

app.post('/test', function(req, res) {
  console.log('request');
  console.log(req.body);

  res.json({'testDataPost' : [1,2,3,4,5,6,7,8,9,0]});
});

//decks
//get
app.get('/api/v0.1/decks', function(req, res) {
  fileIO.getDirectoryContents(deckPath, function(items) {
    const jsonObject = {names: items};
    
    res.json(jsonObject);  
  }, function() {
      console.log('unable to retrieve deck names');

  });

});

//create
app.put('/api/v0.1/decks', function(req, res) {
  const deckName = req.body.deckName;
  fileIO.createNewFile(path.join(__dirname, 'decks', deckName + '.srj'), function() {
      res.json({'result':'success'});

    }, function() {
      res.json({'result':'file-exists'});
    });
});

//update
app.post('/api/v0.1/decks', function(req,res) {

});

//delete
app.delete('/api/v0.1/decks', function(req,res) {

});

app.get('/', function (req, res) {
  //res.send('Hello World!')
  res.sendFile(path.join(__dirname +  "/public/index.html"));
});

app.post('/', function(req, res) {
    console.log(req.body);

});

app.use("/css", express.static(path.join(__dirname, 'public', 'css')));
app.use("/scripts", express.static(path.join(__dirname, 'public', 'scripts')));
app.use("/components/jQuery", express.static(path.join(__dirname, 'bower_components','jQuery','dist')));
app.use("/components/handlebars", express.static(path.join(__dirname, 'bower_components','handlebars' )));

/*fileIO.createNewDeck(path.join(__dirname, 'decks'), 'test1', function() {
  console.log('yayyy!!');

}, function() {
  console.log('grrr!');
});*/



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});