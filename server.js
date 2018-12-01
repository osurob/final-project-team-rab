var bodyParser = require('body-parser');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var tutorData = require('./tutorData');
var fs = require('fs');



var app = express();

var port = 8000;

app.engine('handlebars',exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

//not working to render dynamic posts from postData JSON file

app.use(bodyParser.json());


app.get('/',function(req,res){

    console.log("REQUESTED INDEX");
  res.status(200).render('becomeTutor', {
      photos: tutorData
  });
});

app.post('/', function (req, res, next){
    if(req.body && req.body.photoURL && req.body.description && req.body.price && req.body.subject && req.body.name){
            console.log("-- Client added this info -> ");
            console.log(req.body.photoURL,req.body.description,req.body.price,req.body.subject,req.body.name);
        

        fs.readFile('tutorData.json','utf8', function readFileCallBack(err,data){
            if(err){
                res.status(400).send("Requests to this path must have all json info");
                throw err;
            }else{
                tutorData = JSON.parse(data); //reads the current JSON data, parses to obj
                tutorData.push({photoURL: req.body.photoURL,
                profile: req.body.description,
                price: req.body.price,
                subject: req.body.subject,
                name: req.body.name});//pushes this data to the obj
                var json = JSON.stringify(tutorData); //converts the obj back to JSON
    
                fs.writeFile('tutorData.json', json, function(err){
                    if (err){
                        return console.log(err);
                    }
                    console.log("File was written to");
                }); //write back to JSON
                res.status(200).send("INFO SUCCESSFULLY ADDED");
            }
        });
    }else{
        next();
    }

});

app.get('*', function (req, res) {
  res.status(404);
});


app.listen(port, function () {
  console.log("== Server is listening on port", port);
});
