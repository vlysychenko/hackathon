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
    return {
        /**
         * Stores recommendations which were retrieved from a partner's datastore
         * into the database along with the context, in which the items were recommended
         * @memberOf EEXCESS.logging
         * @param {Array.<Recommendation>} recommendations Recommendations as returned by a query on a partner's datastore
         * @param {Object} context The context in which the recommendations were provided (can e.g. contain a query term)
         * @param {long} timestamp The timestamp, when the recommendations were retrieved
         */
        logRecommendations: function(recommendations, context, timestamp) {
            //EEXCESS.storage.storeRecommendations(recommendations, context, timestamp);
        },
        /**
         * Stores the term of a user-initiated query in the database along with its context.
         * If the user selected a piece of text for example, this is assumed to be the context.
         * @memberOf EEXCESS.logging
         * @param {Integer} tabID Identifier of the browsertab, the query was executed in
         * @param {String} query The query
         * @param {long} timestamp The timestamp, when the recommendations were retrieved
         * @param {String} suffix suffix for the object store name
         */
        logQuery: function(tabID, query, timestamp, suffix, reason, context) {
            /**
             * request the context from the browsertab, the query was sent and
             * execute database transaction on callback
             */
//            EEXCESS.messaging.sendMsgTab(tabID, {method: 'getTextualContext'}, function(data) {
//                EEXCESS.storage.put('queries' + suffix, {query: query, timestamp: timestamp, context: data});
//                // log activated queries on privacy proxy
//                if (suffix === '' && (typeof reason === 'undefined' || reason !== 'manual')) {
              if (suffix === '' && (reason === 'manual')) {
                  console.log('manual query logged');
                    var xhr = $.ajax({
                        url: EEXCESS.config.LOG_QUERY_ACTIVATED_URI,
                        data: JSON.stringify({"uuid": EEXCESS.profile.getUUID(), "queryData": {query: query, timestamp: timestamp, context: context}}),
                        type: 'POST',
                        contentType: 'application/json; charset=UTF-8',
                        dataType: 'json'
                    });
              }
//            });
        },
        /**
         * Stores the user interaction of starting to view a recommended resource
         * @memberof EEXCESS.logging
         * @param {String} resource URI of the viewed resource
         */
        openedRecommendation: function(tabId, resource) {
            console.log('opened recommendation');
            var tmp = {
                resource: resource,
                timestamp: new Date().getTime(),
                type: 'view',
                context: EEXCESS.model.getContext(),
                beenRecommended: true
            };
            tmp['action'] = 'result-view';
            tmp['uuid'] = EEXCESS.profile.getUUID();
            var xhr = $.ajax({
                url: EEXCESS.config.LOG_RVIEW_URI,
                data: JSON.stringify(tmp),
                type: 'POST',
                contentType: 'application/json; charset=UTF-8',
                dataType: 'json'
            });

        },
        /**
         * Logs the duration of a user viewing a recommended resource on closing its view
         * @memberof EEXCESS.logging
         * @param {String} resource URI of the viewed resource
         */
        closedRecommendation: function(tabId, resource) {
            console.log('closed recommendation');
//            EEXCESS.storage.closedRecommendation(resource, function(view) {
//                view['action'] = 'result-close';
//                view['uuid'] = EEXCESS.profile.getUUID();
//                var xhr = $.ajax({
//                    url: EEXCESS.config.LOG_RCLOSE_URI,
//                    data: JSON.stringify(view),
//                    type: 'POST',
//                    contentType: 'application/json; charset=UTF-8',
//                    dataType: 'json'
//                });
//            });
        },

        /**
         * Logs the user interaction of taking a recommended resource to editor
         * @memberof EEXCESS.logging
         * @param {Integer} tabID Identifier of the browsertab, the query was executed in (null in our case)
         * @param {String} resource URI of the viewed resource
         */
        tookRecommendation: function(tabId, resource) {
            console.log('took recommendation');
            var tmp = {
                resource: resource,
                timestamp: new Date().getTime(),
                type: 'take',
                context: EEXCESS.model.getContext(),
                beenRecommended: true
            };
            tmp['action'] = 'result-take';
            tmp['uuid'] = EEXCESS.profile.getUUID();
            var xhr = $.ajax({
                url: EEXCESS.config.LOG_TAKE_URI,
                data: JSON.stringify(tmp),
                type: 'POST',
                contentType: 'application/json; charset=UTF-8',
                dataType: 'json'
            });
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
     * contained visit is stored to the database with the current point of time
     * as ending timestamp. If the current url is the same as in the 'current'-
     * variable, the content of this variable remains unchanged.
     * @memberOf EEXCESS.logging.history
     * @param {String} url The url of the current visit
     * @param {Integer} windowId Identifier of the current window
     * @param {Integer} tabId Identifier of the current browsertab
     */
    var _updateChange = function(url, windowId, tabId) {
//        if (current.url !== url) {
//            if (current.url !== '') {
//                _updateDB({url: current.url, start: current.start, end: new Date().getTime()});
//            }
//            if (!url.startsWith('chrome') && !url.startsWith('https://www.google.de/webhp?sourceid=chrome')) {
//                current.url = url;
//                current.windowId = windowId;
//                current.start = new Date().getTime();
//                current.tabId = tabId;
//            } else {
//                current.reset();
//            }
//        }
    };

    /**
     * Adds additional information to a visit and stores it in the database.
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
//        EEXCESS.history.getVisits(item.url, function(visitItems) {
//            var chromeVisit = visitItems[visitItems.length - 1];
//            item.transition = chromeVisit.transition;
//            item.chrome_visitId = chromeVisit.visitId;
//            EEXCESS.storage.storeVisit(item, chromeVisit.referringVisitId);
//        });
    };

})();



