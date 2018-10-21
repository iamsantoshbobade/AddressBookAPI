/**
 *  @author Santosh Bobade
 *  @file:  test.js
 * 
 *  This file contains test suites to test Create, Retrieve, Update and Delete operations.
 *  Test suits are designed using mocha framework and its chai library.
 * 
 * @see LICENSCE (ISC Licensce).
 */

var chai = require ('chai');                        // Test library for the mocha testing framework
var expect = chai.expect;
var supertest = require ('supertest');
var constants = require ('../constants/constants'); // constants module for application constants

var port = process.env.PORT || constants.DEFAULT_NODEJS_PORT_NUMBER;
var api = supertest ('http://localhost:' + port);

console.log (' Test begins ');

test_index_creation   ();        // Test elasticsearch index creation
test_post_contacts    ();        // Test create/ post contacts to the elasticsearch datastore
test_verify_contacts  ();        // Test retrieve and verify contacts from the elasticsearch datastore
test_update_contacts  ();        // Test update and delete contacts from the elasticsearch datastore
test_invalid_contacts ();        // Test update and delete invalid contacts
test_invalid_phone_numbers ();   // Test create/ post contacts with invalid phone numbers

/** Function to test the test suite for loading the elasticsearch index.
 */
function test_index_creation () {
	describe ('Contact Address Book API Tests Suite #1 : Load Resources', function () {
		it('Test to check index creation on load',  function (success) {
			api.get('/')
			.set('Accept', 'application/json')
			.expect(200, success);
		});
	});

} // test_index_creation

/** Function to test the test suite for creating the contacts and posting it to
 *  the elasticsearch datastore.
 */
function test_post_contacts () {
	describe ('Contact Address Book API Tests Suite #2 : Create Contacts', function () {
		it('POST should create a contact \'user10\' and return 200 response',  function(success){
			api.post('/contact/')
			.set ('Accept', 'application/json')
	    	.send ({
				name: "user10",
		   		lastname: "last10",
		    	address: "street",
		    	email: "user@domain.com",
		    	phone: 12324333334
	    	})
			.expect(200,success);
		});

		it('POST should create a contact \'firstname2\' and return 200 response',  function(success){
			api.post('/contact/')
			.set ('Accept', 'application/json')
	    	.send ({
				name: "firstname2",
		   		lastname: "lastname2",
		    	address: "street address 2",
		    	email: 'firstname@domain.com',
		    	phone: 12324333334
	    	})
			.expect(200,success);
		});
	});

} // test_post_contacts

/** Function to test the test suite for retrieving the contacts from the elasticsearch datastore.
 */
function test_verify_contacts () {
	describe ('Contact Address Book API Tests Suite #3 : Retrieve and Verify Contacts', function () {
		it('Verifying Contact details for contact \'user10\'', function(success) {
			api.get('/contact/user10')
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err, res) {
				expect(res.body).to.include.deep.members( [{ name: 'user10',
				lastname: 'last10',
				email: 'user@domain.com',
    			phone: 12324333334,
    			address: 'street' }] );
 	      		success();
    		});
		});

		it('Verifying Contact details for contact \'firstname2\'', function (success) {
			api.get('/contact/firstname2')
			.set('Accept', 'application/json')
			.expect(200)
			.end(function(err, res) {
				expect(res.body).to.include.deep.members( [{ name: 'firstname2',
				lastname: 'lastname2',
				email: 'firstname@domain.com',
    			phone: 12324333334,
    			address: 'street address 2' }] );
 	      		success();
    		});
		});
	});

} // test_verify_contacts

/** Function to test the test suite for manipulating the contacts from the elasticsearch datastore.
 *  Two types of data manipulation are tested: contact name update, contact name delete
 */
function test_update_contacts () {

	//Test update contact query
	describe ('Contact Address Book API Tests Suite #4 : Update and Delete Contacts', function () {
		it('Update Contact \'user10\' -> \'user18\'', function(success) {
			api.put('/contact/user10')
			.set('Accept', 'application/json')
			.send({name: 'user10', newname: 'user18'})
			.expect(200,success);
		});

		it('Update Contact \'firstname2\' -> \'firstname4\'', function(success) {
			api.put('/contact/firstname2')
			.set('Accept', 'application/json')
			.send({name: 'firstname2', newname: 'firstname4'})
			.expect(200,success);
		});

		it('Delete Contact \'user18\' ', function(success) {
			api.put('/contact/user18')
			.set('Accept', 'application/json')
			.send({name: 'user18'})
			.expect(200,success);
		});

		it('Delete Contact \'firstname4\' ', function(success) {
			api.delete('/contact/firstname4')
			.set('Accept', 'application/json')
			.send({name: 'firstname4'})
			.expect(200,success);
		});
	});

} // test_verify_contacts

/** Function to test the test suite for manipulating the contacts from the elasticsearch datastore.
 *  Two types of data manipulation are tested: contact name update, contact name delete
 */
function test_update_contacts () {
	describe ('Contact Address Book API Tests Suite #4 : Update and Delete Contacts', function () {
		
		//Test update contact query
		it('Update Contact \'user10\' -> \'user18\'', function(success) {
			api.put('/contact/user10')
			.set('Accept', 'application/json')
			.send({name: 'user10', newname: 'user18'})
			.expect(200,success);
		});

		it('Update Contact \'firstname2\' -> \'firstname4\'', function(success) {
			api.put('/contact/firstname2')
			.set('Accept', 'application/json')
			.send({name: 'firstname2', newname: 'firstname4'})
			.expect(200,success);
		});

		//Test delete contact query
		it('Delete Contact \'user18\' ', function(success) {
			api.put('/contact/user18')
			.set('Accept', 'application/json')
			.send({name: 'user18'})
			.expect(200,success);
		});

		it('Delete Contact \'firstname4\' ', function(success) {
			api.delete('/contact/firstname4')
			.set('Accept', 'application/json')
			.send({name: 'firstname4'})
			.expect(200,success);
		});
	});

} // test_verify_contacts

/** Function to test the test suite for manipulating the contacts which does not exist in
 *  the elasticsearch datastore.
 *  Two types of data manipulation are tested: invalid contact name update
 *  and invalid contact name delete
 */
function test_invalid_contacts () {
	describe ('Contact Address Book API Tests Suite #5 : Update and Delete Invalid Contacts', function () {
		
		//Test update invalid contact query
		it('Update Contact \'invalidUser\' ', function (failure) {
			api.put('/contact/invalidUser')
			.set('Accept', 'application/json')
			.send({name: 'invalidUser', newname: 'newusername'})
			.expect(404,failure);
		});

		//Test delete invalid contact query
		it('Delete Contact \'invalidUser\' ', function (failure) {
			api.put('/contact/invalidUser')
			.set('Accept', 'application/json')
			.send({name: 'invalidUser'})
			.expect(404,failure);
		});
	});

} // test_invalid_contacts

/** Function to test the test suite for invalid phone numbers.
 *  Three types of validations are performed: alphanumeric phone number,
 *  phone number longer than 12 digits and a negative phone number.
 */
function test_invalid_phone_numbers () {

	describe ('Contact Address Book API Tests Suite #6 : Post Contacts with Invalid Phone Numbers', function () {
		
		//Test to create contact with phone number with alphabetical characters
		it('Should not create contact \'user123\' because phone number contains alphabetical characters and return 400 response',  function (failure){
			api.post('/contact/')
			.set ('Accept', 'application/json')
	    	.send ({
				name: 'user123',
		   		lastname: 'last10',
		    	address: 'street',
		    	email: 'user@domain.com',
		    	phone: 'ABC12324333334'
	    	})
			.expect(400,failure);
		});

		//Test to create contact with phone number too big
		it('Should not create contact \'user123222\' because phone number is longer than 12 digits and return 400 response',  function (failure){
			api.post('/contact/')
			.set ('Accept', 'application/json')
	    	.send ({
				name: "user123222",
		   		lastname: "lastname2",
		    	address: "street address 2",
		    	email: 'firstname@domain.com',
				phone: '92233720368547758'
	    	})
			.expect(400, failure);
		});

		//Test to create contact with negative phone number
		it('Should not create contact \'user12322244\' because phone number is negative and return 400 response',  function (failure){
			api.post('/contact/')
			.set ('Accept', 'application/json')
			.send ({
				name: "user12322244",
				lastname: "lastname2",
				ddress: "street address 2",
				email: 'firstname@domain.com',
				phone: '-1234'
			})
			.expect(400, failure);
		});
	});

} // test_invalid_phone_numbers
