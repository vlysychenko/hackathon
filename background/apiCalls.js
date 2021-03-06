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

EEXCESS.qXHR;

/**
 * Sends a query with the specified parameters to europeana and hands the results
 * to the success callback or the error message to the error callback.
 * @memberOf EEXCESS
 * @param {String} query The query term
 * @param {Integer} start Item in the results to start with (first item is 1)
 * @param {querySuccess} success callback on success
 * @param {queryError} error callback on error
 */
EEXCESS.euCall = function(queryData, start, success, error) {
    var weightedTerms;
    if (queryData.hasOwnProperty('reason')) {
        weightedTerms = queryData['terms'];
    } else {
        weightedTerms = queryData;
    }
    var query = '';
    for (i = 0; i < 3; i++) {
        if (typeof weightedTerms[i] !== 'undefined') {
            query += weightedTerms[i].text + ' ';
        } else {
            break;
        }
    }
    var x = [];
    console.log(typeof x);
    var _facets = function(item) {
        var facet_list = {};
        var facets = [
            'type',
            'subject',
            'year',
            'language',
            'provider',
            'contributor',
            'dataProvider',
            'rights',
            'ugc',
            'usertags'
        ];
        for (var i = 0, len = facets.length; i < len; i++) {
            var key = facets[i];
            if (typeof item[key] !== "undefined") {
                if (typeof item[key] === "object") {
                    facet_list[key] = item[key][0];
                } else {
                    facet_list[key] = item[key];
                }
            }
        }
        return facet_list;
    };
    console.log('query: ' + query + ' start:' + start);
    var xhr = $.ajax(EEXCESS.backend.getURL()
        + '&query=' + query
        + '&start=' + start
        + '&rows=96&profile=standard'
        );
    xhr.done(function(data) {
        console.log(data);
        if (data.totalResults !== 0) {
            $.map(data.items, function(n, i) {
                n.uri = n.guid;
                n.previewImage = n.edmPreview;
                delete n.edmPreview;
            });
            data.results = data.items;
            delete data.items;
            for (var i = 0, len = data.results.length; i < len; i++) {
                data.results[i].facets = _facets(data.results[i]);
                data.results[i].facets.provider = 'Europeana';
                if (data.results[i].title instanceof Array) {
                    data.results[i].title = data.results[i].title[0];
                }
            }
        }
        console.log(data);
        success(data);
    });
    xhr.fail(function(textStatus) {
        error(textStatus.statusText);
    });
};

/**
 * Sends a query with the specified parameters to an API-endpoint
 * @param {Object} queryData either the weighted query terms directly or containing the weighted query terms in "terms" and a reason for the query in "reason"
 * @param {Integer} start pagination index to start with in the result list
 * @param {Function} success success callback, receives the retrieved results as parameter
 * @param {Function} error error callback, receives the error message as parameter
 */
EEXCESS.frCall_impl = function(queryData, start, success, error) {
    var weightedTerms;
    if (queryData.hasOwnProperty('reason')) {
        weightedTerms = queryData['terms'];
    } else {
        weightedTerms = queryData;
    }
    EEXCESS.profile.getProfile(function(profile) {
        profile['contextKeywords'] = weightedTerms;
        var q = '';
        for (var i = 0; i < weightedTerms.length; i++) {
            q += weightedTerms[i].text;
        }
        profile['queryID'] = '' + EEXCESS.djb2Code(q) + new Date().getTime();
        if (queryData.hasOwnProperty('reason')) {
            profile['context'] = queryData['reason'];
            // apply history policy
            if(profile['context']['reason'] === 'page' && JSON.parse(EEXCESS.storage.local("privacy.policy.history")) === 1) {
                profile['context']['value'] = 'disabled';
            }
        }
        if(EEXCESS.profile.getLanguage() !== undefined
            && EEXCESS.profile.getLanguage() !== 'all'){
            profile['languages'] = [{
               iso2: EEXCESS.profile.getLanguage(),
               competenceLevel: 1.0
            }];
        }
        if (EEXCESS.qXHR && EEXCESS.qXHR.readystate !== 4) {
            EEXCESS.qXHR.abort();
        }
        EEXCESS.qXHR = $.ajax({
            url: EEXCESS.backend.getURL(),
            data: JSON.stringify(profile),
            type: 'POST',
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json',
            timeout: EEXCESS.config.TIMEOUT()
        });
        EEXCESS.qXHR.done(function(data) {
            console.log(data);
            data['results'] = data['result'];
            delete data['result'];
            success(data);
        });
        EEXCESS.qXHR.fail(function(jqXHR, textStatus, errorThrown) {
            if(textStatus !== 'abort') {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
                error(textStatus);
            }
        });
    });
};


// set provider call function and url according to the provided value
// if an inappropriate value is given, set it to fr-stable
EEXCESS.backend = (function() {
    var call = EEXCESS.frCall_impl;
    var url = 'http://eexcess.joanneum.at/eexcess-privacy-proxy/api/v1/recommend';
    var fr_url = 'http://eexcess.joanneum.at/eexcess-privacy-proxy/api/v1/recommend';
    var backend = 'fr-stable';

    return {
        setProvider: function(tabID, provider) {

            backend = provider;
            if (typeof (Storage) !== 'undefined') {
                localStorage.setItem('backend', provider);
            }
            switch (provider) {
                case 'eu':
                    console.log('eu');
                    call = EEXCESS.euCall;
                    url = 'http://europeana.eu/api//v2/search.json?wskey=HT6JwVWha';
                    break;
                case 'fr-devel':
                    console.log('fr-devel');
                    call = EEXCESS.frCall_impl;
                    url = 'http://eexcess-dev.joanneum.at/eexcess-privacy-proxy/api/v1/recommend';
                    break;
                case 'null':
                case 'fr-stable':
                    console.log('fr-stable');
                    call = EEXCESS.frCall_impl;
                    url = EEXCESS.config.FR_STABLE_URL;
                    break;
                case 'self':
                    console.log('self');
                    call = EEXCESS.frCall_impl;
                    url = EEXCESS.config.FR_STABLE_URL;
                    fr_url = url;
                    if (typeof (Storage) !== 'undefined') {
                        var local_url = localStorage.getItem('local_url');
                        if (typeof local_url !== 'undefined' && local_url !== null) {
                            url = local_url;
                        }
                        var local_fr_url = localStorage.getItem('federated_url');
                        if (typeof local_fr_url !== 'undefined' && local_fr_url !== null) {
                            fr_url = local_fr_url;
                        }
                    }

//                    backend = 'fr-stable';
            }
        },
        setURL: function(tabID, urls) {
            if (typeof (Storage) !== 'undefined') {
                localStorage.setItem('local_url', urls.pp);
                localStorage.setItem('federated_url', urls.fr);
            }
            url = urls.pp;
            fr_url = urls.fr;
        },
        getURL: function() {
            if (backend === 'self') {
                return (url + '?fr_url=' + fr_url);
            }
            return url;
        },
        getCall: function() {
            return call;
        },
        getProvider: function() {
            return backend;
        }
    };
}());

//retrieve provider from local storage or set it to 'fr-stable'
//if (typeof (Storage) !== 'undefined' && localStorage.getItem('backend') !== null) {
//    EEXCESS.backend.setProvider(-1, localStorage.getItem('backend'));
//} else {
//    EEXCESS.backend.setProvider(-1, 'fr-stable');
//}
//code to use proxy until fr-stable gets crossdomain
EEXCESS.backend.setURL(-1,{
    pp: EEXCESS.config.PROXY_URL,
    fr: EEXCESS.config.FR_STABLE_URL
});
EEXCESS.backend.setProvider(-1, 'self');