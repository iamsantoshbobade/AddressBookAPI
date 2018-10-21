/**
 *  @author Santosh Bobade
 *  @file:  route.js
 * 
 *  This file contains routes for the Address Book API's Create, Retrieve, Update and Delete contact operations.
 * 
 *  @see LICENSCE (ISC Licensce).
 */

var elasticsearch = require ('elasticsearch');     // loads elasticsearch module
var express= require ('express');
var router= express.Router();
var bodyParser = require('body-parser');          // body parser module for the requests and responses
var constants = require('../constants/constants'); // constants module for application constants

// loads elasticsearch client hosted on the configured host and port
var hostname = process.env.ESHOST || constants.DEFAULT_ELASTICSEARCH_HOST; //use the given hostname or default to 'localhost' for elasticearch server
var esport = process.env.ESPORT || constants.DEFAULT_ELASTICSEARCH_PORT_NUMBER; //use the given port number or default to 9200 for elasticearch server
var host = hostname + ':' + esport;
var client = new elasticsearch.Client({
  host: host,
  log: 'info'
});

var indexName = constants.DEFAULT_INDEX_NAME; //'addressbookindex';

/** This is the default route for the Address Book API.
 *  On the first visit to this route, it creates index with the given index name with the contact model mappings. 
 *  On the subsequent visits, it loads the previously created index.
 */
router.get('/', function(req, res) {

    //check if index already exists and create it if it does not
    client.indices.exists({
        index: indexName
    }, function (error, exists) {

        if (exists === true) {
            console.log('index ' + indexName+ ' already exists');
            res.status(200).send({ success: 'Successfully loaded index ' + indexName+ '  for Address Book API' }); 
        } else {
            let indexMapings = {
                "mappings": {
                    "contact": {
                        "properties": {
                            "name": { "type": "text" },
                            "lastname": { "type": "text" },
                            "phone": { "type": "text"},
                            "address": { "type": "text"},
                            "email": { "type": "text"}
                        }
                    }
                }
            }
            return client.indices.create({
                index: indexName,
                body: indexMapings
            },
             function(err, response){
                    if(err){
                        console.log(err);
                        //failed to create index, server takes the responsibility of the failure by sending error code 500
                        res.status(500).send({ failure: 'Failed to create index ' + indexName+ '  for Address Book API. Please try agai later!' }); 
    
                    }
                    else{
                        res.status(200).send({ success: 'Successfully created index ' + indexName+ '  for Address Book API' }); 
                    }
                });
        }
    });
    
}); // ends here

/** This route supports the GET end-point of the Address Book API.
 *  It is used to retrieve the details of a contact with the given name.
 *  This can be accessed at: GET http://localhost:<PORT>/contact/name
 *  @param name   A request parameter of the GET request
 *  This method always returns "200 OK" response, even if the contact does not exist in the datastore.
 *  As, trying to retrieve a non-existant contact is harmledd. 
 *  User is presented with an appropriate 'No contacts found' response message.
 */
router.route('/contact/:name')
      .get( function(req, res) {
          var name = req.params.name;
          client.search({       //searching the elasticsearch index
                index: indexName,
                type: 'contact',
                body: {
                    query: {
                        query_string:{
                           query: name // the query string is the name of the contact
                        }
                    }
                }
        }).then(function (resp) {
            var results = resp.hits.hits.map(function(hit){
                return hit._source;
            });
            if(results.length == 0) 
                res.status(200).send ('No contacts found with the name: ' + name); 
            else
                res.status(200).send (results);
        
        });
        
    });

/**  This route supports GET end-point of the Address Book API and is used to retrieve
 *   the list of all the contacts currently stored in the elasticsearch datastore.
 *   This can be accessed at: http://localhost:<PORT>/contact/?pageSize={}&page={}&query={}
 *   All the parameters are optional.
 *   @param pageSize the number of results to be shown per page, defaults to the first page
 *   @param page     the start page number, defaults to 10 results per page
 *   @param query    the query to retrieve contacts in the bulk, defaults to retrieve all the contacts
 */
router.route('/contact')
      .get(function(req, res) {
          var pageNum = parseInt (req.query.page) || constants.DEFAULT_START_PAGE_NUM; //start from the given pageNum
          var perPage = parseInt (req.query.pageSize) || constants.DEFAULT_RESULTS_PER_PAGE; //number of results per page
          var userQuery = req.query.query || '{ "query" : { "match_all" : {} } }';
          var searchParams = {
              index: indexName,
              from: (pageNum - 1) * perPage,
              size: perPage,
              body: userQuery
            };
      client.search(searchParams, function (err, resp) {
      if (err) throw err;
      var results = resp.hits.hits.map(function(hit){
          return hit._source.name + "  " + hit._source.lastname + " "+ hit._source.phone;
        });
      res.status(200).send(results);
    });
});
  

/**  This route supports posting (creating) a new contact into the elasticsearch database.
 *   The document will be inserted into the collection pointed by indexName
 *   http://localhost:<PORT>/contact/  
 */
router.route('/contact')  
      .post(function(req, res) {
          var input = req.body;
          // take phone = 000000000 if no phone number is given to test the validations
          var phone = input.phone || 000000000 
          if ( isNaN(phone)  || phone < 0) { // check if the phone number is numeric
            console.log("invalid phone number : must contain only digits");
            res.status(400).send({ Error: "Phone number must be positive and numeric."}); 
        } else if (phone.length > constants.DEFAULT_MAX_ALLOWED_DIGITS_IN_PHONE_NUMBER 
            || phone.length < constants.DEFAULT_MIN_REQUIRED_DIGITS_IN_PHONE_NUMBER) {
                console.log('invalid phone number : must not be greater than ' + constants.DEFAULT_MAX_ALLOWED_DIGITS_IN_PHONE_NUMBER + 
                ' digits or lesser than ' + constants.DEFAULT_MIN_REQUIRED_DIGITS_IN_PHONE_NUMBER);
                res.status(400).send({ Error: 'invalid phone number : must not be greater than ' + constants.DEFAULT_MAX_ALLOWED_DIGITS_IN_PHONE_NUMBER + 
                ' digits or lesser than ' + constants.DEFAULT_MIN_REQUIRED_DIGITS_IN_PHONE_NUMBER}); 
            }
            else {
                //elasticsearch.index() is used to insert a document into elasticsearch datastore 
                client.index({           
                    index: indexName,
                    type: 'contact',
                    body: {
                        name: input.name, 
                        lastname: input.lastname,
                        email: input.email,
                        phone: input.phone, // if passed all the validations, use the phone no. passed in the request body to insert in the datastore
                        address: input.address
                    }
                }, function (error,response) {
                    if (error)
                        res.status(500).send('Something went wrong. Failed to create contact: ' + input.name);
                    else
                        res.status(200).send('Post Success: Contact ' + input.name + ' created successfully.');
                    });
                }	  
            }); 


/** This route supports the PUT end-point of the Address Book API.
 *  It is used to update the details of a contact with the given name.
 *  This can be accessed at: PUT http://localhost:<PORT>/contact/name
 *  @param name     A request parameter of the PUT request
 *  @param newname  A request-body parameter for the new contact name
 *  This method returns "200 OK" response upon successfully updating the coontact.
 *  If the requested contact does not exist in the database then "404 NOT FOUND"
 *  error response message is sent.
 *  Occasionally, "500 Internal Server Error" is shown in case contact exists but something 
 *  unexpectedly went wrong on the server side.
 */
 router.route ('/contact/:name')
       .put (function(req, res) {
        name = req.params.name;
        newname = req.body.newname;
        client.search({   //searching the elasticsearch database     
            index: indexName,
            type: 'contact',
            body: {
                query: {
                    query_string:{
                       query: name
                    }
                }
            }
    }).then(function (resp) {
         var results = resp.hits.hits.map(function(hit){
            return hit._source;
        });
        if (results.length == 0) {
            console.log (name + ' does not exist.');
            var msg = name + ' does not exist.';
            res.status(404).send({"Put Error": msg});
        } else {
            client.updateByQuery({ 
                index: indexName,
                type: 'contact',
                body: { 
                   "query": { "match": { "name": name } }, 
                   "script":  "ctx._source.name =  "+ "'"+ newname +"' "+";" 
                }
             }, function (error, response) {
                  
                  if(error){
                    console.log ('Something went wrong. Failed to update' + name);
                    var msg = 'Something went wrong. Failed to update' + name + '\n Please try again later!';
                    res.status(500).send({"Put Error": msg});
                    //server takes responsibilti of this failure by sending 500 Error Code
                  }
                   
                    else{
                        console.log (name + ' updated successfully.');
                        var msg = name + ' updated successfully.';
                        res.status(200).send({"Put Success": msg});
                    }          
              }); 
        }
    
    }); // ends here
        
    	 
    });

/** This route supports the DELETE end-point of the Address Book API.
 *  It is used to update the details of a contact with the given name.
 *  This can be accessed at: DELETE http://localhost:<PORT>/contact/name
 *  @param name    A request parameter of the DELETE request
 *  This method returns "200 OK" response upon successfully deleting the coontact.
 *  If the requested contact does not exist in the database then "404 NOT FOUND"
 *  error response message is sent.
 *  Occasionally, "500 Internal Server Error" is shown in case contact exists but something 
 *  unexpectedly went wrong on the server side.
 */

router.route('/contact/:name')
      .delete(function(req, res) {
    name = req.params.name;
    client.search({       //searching the elasticsearch index
        index: indexName,
        type: 'contact',
        body: {
            query: {
                query_string:{
                   query: name // the query string is the name of the contact
                }
            }
        }
}).then(function (resp) {
     var results = resp.hits.hits.map(function(hit){
        return hit._source;
    });

    if (results.length == 0) {
        console.log (name + ' does not exist.');
        var msg = name + ' does not exist.';
        res.status(404).send({"Delete Error": msg});
    } else {
        client.deleteByQuery({
            index: indexName,
            type: 'contact',
            body: {
               query: {
                   match: { name: name }
               }
            }
          }, function (error, response) {
              
              if (error){
                console.log ('Something went wrong. Failed to delete' + name);
                var msg = 'Something went wrong. Failed to delete' + name + '\n Please try again later!';
                res.status(500).send({"Delete Error": msg}); //server takes responsibilti of this failure by sending 500 Error Code
              }
               
                else{
                    console.log (name + ' deleted successfully.');
                    var msg = name + ' deleted successfully.';
                    res.status(200).send({"Delete Success.": msg});
                }          
          }); 
    }
});  
});

module.exports = router;