/**
 * Extend the String object with a 'startsWith' method
 */
if (typeof String.prototype.startsWith !== 'function') {
    /**
     * Checks, if a string-object starts with the provided term
     * @global
     * @param {String} str the term to check
     * @returns {Boolean} true, if the string starts with the provided term, otherwise false
     */
    String.prototype.startsWith = function(str) {
        return this.slice(0, str.length) === str;
    };
}

var EEXCESS = EEXCESS || {};

/**
 * Encapsulates functionality for logging user actions.
 * @namespace EEXCESS.logging
 * @type {Object}
 * @returns {Object} Returns a set of functions for logging user actions
 */
EEXCESS.logging = (function() {
    /**
     * The indexedDB's identifier for the entry of the latest textual input logged.
     * User input's are (iner alia) logged by a timeout, thus a user may still
     * be adding text to the same field after the text input was logged. The
     * avoidance of duplicates is achieved by checking if current input to be
     * logged extends the latest entry in the database.
     */
    var lastInputTextId = -1;
    return {
        /**
         * Encapsulates functionality for logging user tasks
         * @namespace EEXCESS.logging.tasks
         */
        tasks: {
            /**
             * Store the provided starting task into the indexedDB
             * @memberOf EEXCESS.logging.tasks
             * @param {Task_db} task The task to start
             * @param {startedTaskStored} callback Function to call with the indexedDB's identifier of the task after storing it
             */
            startTask: function(task, callback) {
                // 111
            },
            /**
             * Modifies the start time of the task with the provided id and adds an end time.
             * @memberOf EEXCESS.logging.tasks
             * @param {Integer} task_id The identifier for the task in the indexedDB
             * @param {{start:String,end:String}} data Start and end time of the task, encoded as ISO 8601
             */
            stopTask: function(task_id, data) {
                // 111
            },
            /**
             * Adds a topic to task in the database, specified by the id
             * @memberof EEXCESS.logging.tasks
             * @param {Integer} task_id The identifier of the task for which to add the topic
             * @param {Topic} topic The topic to add
             */
            addTopic: function(task_id, topic) {
                // 111
            },
            /**
             * Sets the 'recommendations desirable' flag of the task with the
             * given identifier to the provided value.
             * @memberOf EEXCESS.logging.tasks
             * @param {Integer} task_id The task's identifier in the indexedDB
             * @param {Boolean} desirable Flag, indicating if recommendations are desirable for this task
             */
            recommendationsDesirable: function(task_id, desirable) {
                // 111
            },
            /**
             * Sets the level of expertise of the task with the given id to the
             * provided value.
             * @memberOf EEXCESS.logging.tasks
             * @param {Integer} task_id The task's identifier in the indexedDB
             * @param {Integer} level The level of expertise (ranging from 0-10)
             */
            changeExpertiseLevel: function(task_id, level) {
                // 111
            },
            /**
             * Removes the specfied topic from the task with the given id
             * @memberOf EEXCESS.logging.tasks
             * @param {Integer} task_id The task's identfier in the indexedDB
             * @param {Topic} topic
             */
            removeTopic: function(task_id, topic) {
                // 111
            }
        },
        /**
         * Stores recommendations which were retrieved from a partner's datastore
         * into the indexedDB along with the context, the items were recommended
         * @memberOf EEXCESS.logging
         * @param {Array.<Recommendation>} recommendations Recommendations as returned by a query on a partner's datastore
         * @param {Object} context The context in which the recommendations were provided (can e.g. contain a query term)
         */
        logRecommendations: function(recommendations, context, timestamp) {
            // 111
        },
        /**
         * Stores the term of a user-initiated query in the indexedDB along with its context.
         * If the user selected a piece of text, this is assumed to be the context, otherwise
         * the text currently in the viewport makes the context. (if a paragraph starts in the viewport,
         * but ends outside, while still contained in the same DOM-node, the whole paragraph is stored
         * @memberOf EEXCESS.logging
         * @param {Integer} tabID Identifier of the browsertab, the query was executed in
         * @param {String} query The query term
         */
        logQuery: function(tabID, query, timestamp) {
            // 111
        },
        /**
         * Stores the user interaction of starting to view a recommended resource
         * @memberof EEXCESS.logging
         * @param {Integer} tabID Identifier of the browsertab, the request originated
         * @param {String} resource URI of the viewed resource
         */
        openedRecommendation: function(tabID, resource) {
            // 111

        },
        /**
         * Logs the duration of a user viewing a recommended resource on closing its view
         * @memberof EEXCESS.logging
         * @param {Integer} tabID Identifier of the browsertab, the request originated
         * @param {String} resource URI of the viewed resource
         */
        closedRecommendation: function(tabID, resource) {
            // 111
        },
        /**
         * Retrieves the user's demographics from the indexedDB and hands them over
         * to a callback on success.
         * @memberOf EEXCESS.logging
         * @param {Integer} tabID Identfier of the browsertab, the request originated
         * @param {Object} data not used
         * @param {demographicsResult} callback Function to call with the retrieved demographics
         */
        getDemographics: function(tabID, data, callback) {
            // 111
        },
        /**
         * Stores demographics of a user in the indexedDB
         * @memberof EEXESS.logging
         * @param {Integer} tabID Identifier of the browsertab, the request originated
         * @param {Array} data Demographics of a user, represented as an array of <name,value> pairs
         * @param {messageCallback} callback Function to inform requester about success
         */
        setDemographics: function(tabID, data, callback) {
            // 111
        },
        /**
         * Stores text a user has entered on a webpage in the database
         * @memberOf EEXCESS.logging
         * @param {Integer} tabID Identifier of the browsertab, the request originated
         * @param {String} input The input text to log
         */
        logInput: function(tabID, input) {
            // 111
        },
        /**
         * Stores a mouse click in the indexedDB
         * @memberOf EEXCESS.logging
         * @param {Integer} tabID Identifier of the browsertab, the request originated
         * @param {Object} clickData Data associated with the click (timestamp, position, ...)
         */
        logClick: function(tabID, clickData) {
            // 111
        },
        /**
         * Stores a submitted form in the indexedDB
         * @memberOf EEXCESS.logging
         * @param {Integer} tabID Identifier of the browsertab, the request originated
         * @param {Array} submitData Array of name/value pairs, containing the form data
         */
        logSubmit: function(tabID, submitData) {
            // 111
        }
    };
}());

/**
 * Encapsulates functionality for logging history events
 * @namespace EEXCESS.logging.history
 */
EEXCESS.logging.history = (function() {
    // represents the current visit
    var current = {
        url: '',
        windowId: -1,
        start: 0,
        tabId: -1,
        reset: function() {
            this.url = '';
            this.windowId = -1;
            this.start = 0;
            this.tabId = -1;
        }
    };

    /**
     * Sets the variable 'current' to the current visit with the current point of
     * time as starting timestamp. If the variable already contained another visit, the
     * contained visit is stored to the indexedDB with the current point of time
     * as ending timestamp. If the current url is the same as in the 'current'-
     * variable, the content of this variable remains unchanged.
     * @memberOf EEXCESS.logging.history
     * @param {String} url The url of the current visit
     * @param {Integer} windowId Identifier of the current window
     * @param {Integer} tabId Identifier of the current browsertab
     */
    var _updateChange = function(url, windowId, tabId) {
        // 111
    };

    /**
     * Adds additional information to a visit and stores it in the indexedDB.
     * The information added covers:
     * - transition (as obtained by chrome API)
     * - chrome_visitId (a corresponding identifier in chrome's history)
     * - referrer (url of the referrer, may be empty)
     * @memberOf EEXCESS.logging.history
     * @param {Object} item A visit item
     * @param {String} item.url The visit's url
     * @param {Number} item.start Start of the visit in milliseconds from the epoch
     * @param {Number} item.end End of the visit in milliseconds from the epoch
     */
    var _updateDB = function(item) {
        // 111
    };

})();



