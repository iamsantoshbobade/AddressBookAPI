/** This file contains all the constants used for this application.
 *  @author Santosh Bobade
 * 
 *  @see LICENSCE (ISC Licensce).
 */

module.exports = Object.freeze ({
    DEFAULT_NODEJS_PORT_NUMBER : 8000, //the default port number for the NodeJS server
    DEFAULT_ELASTICSEARCH_HOST : 'localhost', //the default hostname for the ElasticSearch datastore
    DEFAULT_ELASTICSEARCH_PORT_NUMBER : 9200, //the default port number for the ElasticSearch datastore
    DEFAULT_MAX_ALLOWED_DIGITS_IN_PHONE_NUMBER: 12, // the default max length for a phone number
    DEFAULT_MIN_REQUIRED_DIGITS_IN_PHONE_NUMBER: 7, // the default min length for a phone number
    DEFAULT_START_PAGE_NUM: 1, // the default start page number for the search results
    DEFAULT_RESULTS_PER_PAGE: 10, // the default number of results per page

    /** The default name of the index for the contacts elasticsearch datastore, 
     *  this must be lowercase as required by the ElasticSearch definitive guide.
     *  @see https://www.elastic.co/guide/en/elasticsearch/guide/current/_document_metadata.html#_index
     */
    DEFAULT_INDEX_NAME: 'addressbooknewindex' 
});

