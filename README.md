# AddressBookAPI
##### An address book RESTful API using Express and Elastic Search
Santosh Bobade,
MS in CS, UGA, GA.

######  Technology Stack
NodeJS, Express, ElasticSearchJS, ElasticSearch datastore, Mocha, Chai, Supertest

###### Features:
*	GET - Get the list of all contacts currently stored, Get contacts by a name
*	POST - Insert a new contact into the data store
*	PUT - Updates a contact in the data store
*	DELETE - Deletes a contact from the data store

###### Dependencies:
*	node.js
*	express
*	elasticsearch datastore

###### Installation Guide:
1. Clone the git repository / download and extract the .zip file.
2. Navigate into the root directory of the extracted path on the command line tool/  terminal and use `npm install` command to install all the dependencies listed in package.json.
3. Download and install elasticsearch datastore from https://www.elastic.co/downloads/elasticsearch

###### How to run the application:

* Execute `Path/To/ElasticSearch/bin/elasticsearch`. It launches the Elastic Search server `http://localhost:9200`, by default. 
Point your browser to `http://localhost:9200`, the default message with the elasticsearch version compatibility implies successful launch. ElasticSearch can be made to run on a different port by modifying `port` in the `Path/To/ElasticSearch/config/elasticsearch.yml`file.
* The port (in the Address Book API) can be configured in the 2 ways:
	1. By setting the desired value for  `DEFAULT_ELASTICSEARCH_PORT_NUMBER` constant in the `constants/constants.js` file.
	2. By setting the environment variable. Use the following command to set environment variable `export ESPORT=7800`. To unset and release the same port, use the following command `unset ESPORT=7880`.
* Please note that: ElasticSearch server and Address Books `DEFAULT_ELASTICSEARCH_PORT_NUMBER` or the environment variable `ESPORT` must be the same. 

* The host (in the Address Book API) can be configured in the 2 ways:
	1. By setting the desired value for  `DEFAULT_ELASTICSEARCH_HOST` constant in the `constants/constants.js` file.
	2. By setting the environment variable. Use the following command to set environment variable `export ESHOST=localhost`. To unset and release the same port, use the following command `unset ESPORT=localhost`. 

* Navigate into the root directory of the extracted zip file and type `node server.js`  or `npm start`to start the server. The server can be accessed at `http://localhost:8000`, 
* The port can be configured in the 2 ways:
	1. By setting the desired value for  `DEFAULT_NODEJS_PORT_NUMBER` constant in the `constants/constants.js` file.
	2. By setting the environment variable. Use the following command to set environment variable `export PORT=8440`. To unset and release the same port, use the following command `unset PORT=8440`.


###### REST API URLs
* GET	` http://localhost:8000/contact/name`
* GET(all contacts) `http://localhost:8000/?pageSize={size}&page={offset}&query={elasticsearch-query-string}`
* POST `http://localhost:8000/contact/` the request's body looks like:
	```json
	{
		"name": "John",
		"lastname": "Smith",
		"email": "jsmith@domain.com",
		"phone":"123456789",
		"address": "Athens, GA"
	}
	```

* PUT `http://localhost:8000/contact/oldName`
	```json
	{
	"newname": "newName"
	}
	```
	
* DELETE `http://localhost:8000/contact/name`

###### Test Frameworks and Libraries
* I have used the following testing frameworks and libraries for unit testing of this API:
Mocha, Chai and Supertest
		
Here are the results for a sucessfull test run!!

![Alt text](../images?raw=true "Test Results")
