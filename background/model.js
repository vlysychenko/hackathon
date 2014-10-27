
var EEXCESS = EEXCESS || {};

/**
 * Encapsulates functionality for the model of the eexcess widget
 * @namespace EEXCESS.model
 */
EEXCESS.model = (function() {
    // general widget parameters
    var params = {
        visible: false,
        tab: 'results'
    };
    /**
     * Represents the current query and according results
     */
    var results = {
        query: 'Search',
        data: null,
        weightedTerms: null
    };

    /*
     * retrieved results from automatic queries which are cached until the user activates them
     */
    var cachedResult = {};

    var openResult = null;

    var _handleResult = function(res) {
        var execute = function(items) {
            var euLanguageFilter = function(result){
                return result.language.indexOf(EEXCESS.profile.getLanguage()) >= 0;
            }
            var frLanguageFilter = function(result){
                return result.facets.language.indexOf(EEXCESS.profile.getLanguage()) >= 0;
            }
            if(EEXCESS.profile.getLanguage() !== undefined
                && EEXCESS.profile.getLanguage() !== 'all'
            ){
                var languageFilter;
                switch(EEXCESS.backend.getProvider()){
                    case 'eu':
                        languageFilter = euLanguageFilter;
                        break;
                    default:
                        languageFilter = frLanguageFilter;
                        break;
                }
                res.data.results = items.filter(languageFilter);
                res.data.totalResults = res.data.results.length;
            }else{
                res.data.results = items;
            }
            results = res;

                EEXCESS.sendMsgAll({
                    method: 'newSearchTriggered',
                    data: {query: results.query, results: results.data}
                });
        };

        // update ratings first
        EEXCESS.storage.getRatings(res.data.results, res.query, execute, function() {
            execute(res.data.results);
        });
    };


    /**
     * Update results to a query with ratings from the database and send each
     * updated result to all tabs
     * @memberOf EEXCESS.model
     * @param {Array.<Recommendation>} items The results, for which to retrieve
     * ratings
     */
    var _updateRatings = function(items) {
        var offset = results.data.results.length - items.length;
        for (var i = 0, len = items.length; i < len; i++) {
            if (typeof items[i].uri !== 'undefined') {
                EEXCESS.annotation.getRating(items[i].uri, {query: results.query}, function(score) {
                    results.data.results[this.pos].rating = score;
                    EEXCESS.sendMsgAll({
                        method: {parent: params.tab, func: 'rating'},
                        data: {uri: this.uri, score: score}
                    });
                }.bind({pos: i + offset, uri: items[i].uri}));
            }
        }
    };
    var _queryTimestamp;
    return {
        /**
         * Toggles the visibility of the widget
         * @memberOf EEXCESS.model
         * @param {String} url the url of the current page
         * @returns {Boolean} true if visible, otherwise false
         */
        toggleVisibility: function(tabID, url) {
            var _finally = function(url) {
                params.visible = !params.visible;
                var xhr = $.ajax({
                    url: EEXCESS.config.LOG_SHOW_HIDE_URI,
                    data: JSON.stringify({visible: params.visible, uuid: EEXCESS.profile.getUUID(), currentPage: url}),
                    type: 'POST',
                    contentType: 'application/json; charset=UTF-8',
                    dataType: 'json'
                });
                EEXCESS.sendMsgAll({method: 'visibility', data: params.visible});
            };
            if (url === -1) {
                EEXCESS.tabs.get(tabID, function(tab) {
                    _finally(tab.url);
                });
            } else {
                _finally(url);
            }
        },
        /**
         * Executes the following functions:
         * - log the query
         * - set widget's tab to 'results'
         * - query API-endpoint
         * After a successful query to the endpoint, the obtained results will be
         * logged in the database and enriched with ratings from the database.
         * Furthermore they are set as the current results in the widget's model.
         * At logging the recommendations, query is added as context.
         * @memberOf EEXCESS.model
         * @param {Integer} tabID Identifier of the browsertab, the request
         * originated
         * @param {Object} data The query data
         */
        query: function(tabID, data) {
            console.log(data);
            var tmp = {};
            _queryTimestamp = new Date().getTime();
            if (data.hasOwnProperty('reason')) {
                tmp['weightedTerms'] = data['terms'];
                tmp['reason'] = data['reason'];
            } else {
                tmp['weightedTerms'] = data;
            }
            tmp['query'] = '';
            for (var i = 0, len = tmp['weightedTerms'].length; i < len; i++) {
                tmp['query'] += tmp['weightedTerms'][i].text;
                if (i < len - 1) {
                    tmp['query'] += ' ';
                }
            }
            if (tmp['query'] === '') {
                EEXCESS.sendMessage(tabID, {method: {parent: 'results', func: 'error'}, data: 'query is empty...'});
                return;
            }
            params.tab = 'results';
            var contextObj = $.extend({url: document.URL}, tmp.hasOwnProperty('reason') ? tmp['reason'] : {});
            // log all queries
            EEXCESS.logging.logQuery(tabID, tmp['weightedTerms'], _queryTimestamp, '_full',(tmp['reason'] || ''),
                contextObj);
            var success = function(data) { // success callback
                // TODO: search may return no results (although successful)
                tmp['data'] = data;
                if (data.totalResults !== 0) {
                    // create context
                    var context = {query: tmp['query']};
                    // log results
                    EEXCESS.logging.logRecommendations(data.results, context, _queryTimestamp);
                    _handleResult(tmp);
                }else{
                    EEXCESS.sendMsgAll({
                        method: 'newSearchTriggered',
                        data: {query: tmp.query, results: tmp.data}
                    });
                }

            };
            var error = function(error) { // error callback
                EEXCESS.sendMessage(tabID, {method: {parent: 'results', func: 'error'}, data: error});
            };
            // call provider (resultlist should start with first item)
            EEXCESS.backend.getCall()(data, 1, success, error);
        },
        /**
         * Sends the current model state to the specified callback
         * @memberOf EEXCESS.model
         * @param {Integer} tabID Identifier of the browsertab, the request
         * originated
         * @param {Object} data not used
         * @param {Function} callback
         */
        widget: function(tabID, data, callback) {
            callback({params: params, results: results});
        },
        /**
         * Sends the current visibility state of the widget to the specified
         * callback
         * @memberOf EEXCESS.model
         * @param {Integer} tabID Identifier of the browsertab, the request
         * originated
         * @param {Object} data not used
         * @param {Function} callback
         */
        visibility: function(tabID, data, callback) {
            callback(params.visible);
        },
        /**
         * Sets the rating score of a resource in the resultlist to the
         * specified value, stores the rating and informs all other tabs.
         * The query  is added to the rating as context.
         * @memberOf EEXCESS.model
         * @param {Integer} tabID Identifier of the browsertab, the request
         * originated
         * @param {Object} data rating of the resource
         * @param {String} data.uri URI of the rated resource
         * @param {Integer} data.score Score of the rating
         * @param {Integer} data.pos Position of the resource in the resultlist
         */
        rating: function(tabID, data) {
            var context = {query: results.query};
            EEXCESS.annotation.rating(data.uri, data.score, context, true);
            results.data.results[data.pos].rating = data.score;
        },
        /**
         * Returns the model's current context. The context contains the current
         * query (if any)
         * @memberOf EEXCESS.model
         * @returns {Object} the context
         */
        getContext: function() {
            var context = {};
            if (results.query !== 'Search') {
                context.query = results.query;
            }
            return context;
        },
        /**
         * Hands in the current query and corresponding results to the specified callback
         * @param {Integer} tabID Identifier of the browsertab, the request
         * originated
         * @param {Object} data unused
         * @param {Function} callback
         */
        getResults: function(tabID, data, callback) {
            callback({query: results.query, results: results.data});
        },
        resultOpened: function(tabID, data, callback) {
            EEXCESS.windows.getCurrent({populate: true}, function(win) {
                for (var i = 0; i < win.tabs.length; ++i) {
                    if (win.tabs[i].url === data) {
                        openResult = {id: win.tabs[i].id, url: data};
                        EEXCESS.logging.openedRecommendation(data);
                        break;
                    }
                }
            });
        }
    };
}());
