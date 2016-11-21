var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// our db models
var Card = require("../models/card.js");
var Course = require("../models/course.js");

// S3 File dependencies
var AWS = require('aws-sdk');
var awsBucketName = process.env.AWS_BUCKET_NAME;
var s3Path = process.env.AWS_S3_PATH; // TODO - we shouldn't hard code the path, but get a temp URL dynamically using aws-sdk's getObject
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});
var s3 = new AWS.S3();

// file processing dependencies
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {

  console.log('home page requested!');

  var jsonData = {
  	'name': 'itp-directory',
  	'api-status':'OK'
  }

  // respond with json data
  //res.json(jsonData)

  // respond by redirecting
  //res.redirect('/directory')

  // respond with html
  res.render('Homepage.html')

});

router.get('/card-page', function(req,res){

  res.render('card-page.html')

})

router.get('/add-person', function(req,res){

  res.render('add.html')

})

router.get('/add-person-with-image', function(req,res){

  res.render('add-with-image.html')

})

router.get('/add-cards', function(req,res){

  res.render('add-cards.html')

})

router.get('/directory', function(req,res){

  res.render('directory.html')

})


router.get('/edit/:id', function(req,res){

  var requestedId = req.params.id;

  Card.findById(requestedId,function(err,data){
    if(err){
      var error = {
        status: "ERROR",
        message: err
      }
      return res.json(err)
    }

    console.log(data); 

    var viewData = {
      pageTitle: "Edit " + data.name,
      card: data
    }

    res.render('edit.html',viewData);

  })

})



router.get('/edit/:id', function(req,res){

  var requestedId = req.params.id;

  Card.findById(requestedId,function(err,data){
    if(err){
      var error = {
        status: "ERROR",
        message: err
      }
      return res.json(err)
    }

    var viewData = {
      status: "OK",
      card: data
    }

    return res.render('edit.html',viewData);
  })
})


router.post('/api/create', function(req,res){

  console.log(req.body);

  var cardObj = {
    name: req.body.name,
    where: req.body.where,
    month: req.body.month,
    date: req.body.date,
    year: req.body.year
  }

  var card = new Card(cardObj);

  card.save(function(err,data){
    if(err){
      var error = {
        status: "ERROR",
        message: err
      }
      return res.json(err)
    }

    var jsonData = {
      status: "OK",
      card: data
    }

    return res.redirect('/directory');

  })

})

router.post('/api/edit/:id', function(req,res){

  console.log(req.body);
  var requestedId = req.params.id;

  var cardObj = {
    name: req.body.name,
    where: req.body.where,
    month: req.body.month,
    date: req.body.date,
    year: req.body.year
  }

  console.log(cardObj);

  Card.findByIdAndUpdate(requestedId,cardObj,function(err,data){
    if(err){
      var error = {
        status: "ERROR",
        message: err
      }
      return res.json(error)
    }

    var jsonData = {
      status: "OK",
      card: data
    }

    //return res.json(jsonData);

    return res.redirect('/directory');

  })

})

router.post('/api/create/image', multipartMiddleware, function(req,res){

  console.log('the incoming data >> ' + JSON.stringify(req.body));
  console.log('the incoming image file >> ' + JSON.stringify(req.files.image));

  var cardObj = {
    name: req.body.name,
    where: req.body.where,
    month: req.body.month,
    date: req.body.date,
    year: req.body.year
  }

  // NOW, we need to deal with the image
  // the contents of the image will come in req.files (not req.body)
  var filename = req.files.image.name; // actual filename of file
  var path = req.files.image.path; // will be put into a temp directory
  var mimeType = req.files.image.type; // image/jpeg or actual mime type
  
  // create a cleaned file name to store in S3
  // see cleanFileName function below
  var cleanedFileName = cleanFileName(filename);

  // We first need to open and read the uploaded image into a buffer
  fs.readFile(path, function(err, file_buffer){

    // reference to the Amazon S3 Bucket
    var s3bucket = new AWS.S3({params: {Bucket: awsBucketName}});
    
    // Set the bucket object properties
    // Key == filename
    // Body == contents of file
    // ACL == Should it be public? Private?
    // ContentType == MimeType of file ie. image/jpeg.
    var params = {
      Key: cleanedFileName,
      Body: file_buffer,
      ACL: 'public-read',
      ContentType: mimeType
    };
    
    // Put the above Object in the Bucket
    s3bucket.putObject(params, function(err, data) {
      if (err) {
        console.log(err)
        return;
      } else {
        console.log("Successfully uploaded data to s3 bucket");

        // now that we have the image
        // we can add the s3 url our person object from above
        cardObj['imageUrl'] = s3Path + cleanedFileName;

        // now, we can create our person instance
        var card = new Card(cardObj);

        card.save(function(err,data){
          if(err){
            var error = {
              status: "ERROR",
              message: err
            }
            return res.json(err)
          }

          var jsonData = {
            status: "OK",
            card: data
          }

          return res.json(jsonData);        
        })

      }

    }); // end of putObject function

  });// end of read file

})

function cleanFileName (filename) {
    
    // cleans and generates new filename for example userID=abc123 and filename="My Pet Dog.jpg"
    // will return "abc123_my_pet_dog.jpg"
    var fileParts = filename.split(".");
    
    //get the file extension
    var fileExtension = fileParts[fileParts.length-1]; //get last part of file
    
    //add time string to make filename a little more random
    d = new Date();
    timeStr = d.getTime();
    
    //name without extension
    newFileName = fileParts[0];
    
    return newFilename = timeStr + "_" + fileParts[0].toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_') + "." + fileExtension;
    
}

router.get('/api/get', function(req,res){

  Card.find(function(err,data){

      if(err){
        var error = {
          status: "ERROR",
          message: err
        }
        return res.json(err)
      }

      var jsonData = {
        status: "OK",
        cards: data
      }

      return res.json(jsonData);

  })

})

router.get('/api/get/year/:where',function(req,res){

  var requestedwhere = req.params.where;

  console.log(requestedwhere);

  Card.find({where:requestedwhere},function(err,data){
      if(err){
        var error = {
          status: "ERROR",
          message: err
        }
        return res.json(err)
      }

      var jsonData = {
        status: "OK",
        cards: data
      }

      return res.json(jsonData);    
  })

})

// example query --> /api/get/query?itpYear=2016&name=Sam
// --> itpYear=2016
// --> name=Sam
router.get('/api/get/query',function(req,res){

  console.log(req.query);

  // start with an empty searchQuery object
  var searchQuery = {};

  // if itpYear is in the query, add it to the searchQuery object
  if(req.query.where){
    searchQuery['where'] =  req.query.where
  } 
  // in the above example, searchQuery is now --> { itpYear: 2016 }

  // if name is in the query, add it to the searchQuery object
  if(req.query.name){
    searchQuery['year'] =  req.query.year
  }
  // in the above example, searchQuery is now { itpYear: 2016, name: Sam}

  Card.find(searchQuery,function(err,data){
    res.json(data);
  })

  // Person.find(searchQuery).sort('-name').exec(function(err,data){
  //   res.json(data);
  // })  

})


/**
 * GET '/api/
 /:id'
 * Receives a GET request specifying the animal to delete
 * @param  {String} req.param('id'). The animalId
 * @return {Object} JSON
 */

router.get('/api/delete/:id', function(req, res){

  var requestedId = req.param('id');

  // Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  Card.findByIdAndRemove(requestedId,function(err, data){
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that card to delete'};
      return res.json(error);
    }

    // otherwise, respond back with success
    var jsonData = {
      status: 'OK',
      message: 'Successfully deleted id ' + requestedId
    }

    // res.json(jsonData);
    return res.redirect('/directory');

  })
})

module.exports = router;


