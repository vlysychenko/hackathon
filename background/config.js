var EEXCESS = EEXCESS || {};


EEXCESS.config =

(function() {

    // init privacy policy
    if(typeof EEXCESS.storage.local('privacy.policy.address') === 'undefined') {
        EEXCESS.storage.local('privacy.policy.address', 2);
    }
    if(typeof EEXCESS.storage.local('privacy.policy.birthdate') === 'undefined') {
        EEXCESS.storage.local('privacy.policy.birthdate', 1);
    }
    if(typeof EEXCESS.storage.local('privacy.policy.firstname') === 'undefined') {
        EEXCESS.storage.local('privacy.policy.firstname', 0);
    }
    if(typeof EEXCESS.storage.local('privacy.policy.gender') === 'undefined') {
        EEXCESS.storage.local('privacy.policy.gender', 0);
    }
    if(typeof EEXCESS.storage.local('privacy.policy.history') === 'undefined') {
        EEXCESS.storage.local('privacy.policy.history', 1);
    }
    if(typeof EEXCESS.storage.local('privacy.policy.lastname') === 'undefined') {
        EEXCESS.storage.local('privacy.policy.lastname', 0);
    }
    if(typeof EEXCESS.storage.local('privacy.policy.topics') === 'undefined') {
        EEXCESS.storage.local('privacy.policy.topics', 0);
    }
    if(typeof EEXCESS.storage.local('privacy.policy.uuid') === 'undefined') {
        EEXCESS.storage.local('privacy.policy.uuid', 0);
    }

    var _PP_BASE_URI = 'http://eexcess-dev.joanneum.at/eexcess-privacy-proxy/';
    var _LOG_RATING_URI = _PP_BASE_URI + 'log/rating';
    var _LOG_RVIEW_URI = '/testAjax.php';
    var _LOG_RCLOSE_URI = _PP_BASE_URI + 'log/rclose';
    var _LOG_TAKE_URI = '/testAjax.php';
    var _LOG_SHOW_HIDE_URI = _PP_BASE_URI + 'log/show_hide';
    var _LOG_FACETSCAPE_URI =  '/testAjax.php';
    var _DISAMBIGUATE_URI = _PP_BASE_URI + 'disambiguate';
    var _LOG_QUERY_ACTIVATED_URI = '/testAjax.php';
    var _LANGUAGES_AVAILABLE = ['de', 'en', 'all'];
    var _VOTE_URL = '/testAjax.php';
    var _ADD_RATING_URL = '/testAjax.php';
    var _MCE_ID = 'text_editor';
    var _ID_IFRAME_ELEMENT = '#tinyMce iframe';
    var _STORAGE_URLS = { };
    var _QUERY_HISTORY_URL = '/get_query_history.php';
    var _BACKSPACE_CODE = 8;
    var _SPACE_CODE = 32;
    var _ENTER_CODE = 13;
    var _POINT_CODE = 190;
    var _ALLOWED_DELIMITER_VALUES = [
        'sentence',
        'word',
        'string'
    ];
    var _FR_STABLE_URL
        = 'http://eexcess.joanneum.at/eexcess-federated-recommender-web-service-1.0-SNAPSHOT/recommender/recommend';
    var _PROXY_URL = '/eexcess_proxy.php';

    var _TIMEOUT = function(param) {
        if(typeof param !== 'undefined') {
            // TODO add specific timeouts
            return 10000;
        }
        return 10000;
    };

    var _PROFILE_URI = '/profile.php';

    var _PRIVACY_LEVELS = {
        'high': {
            'privacy.policy.address': 2
        },
        'middle': {
            'privacy.policy.address': 4,
            'privacy.policy.gender' : 1,
            'privacy.policy.birthdate': 3
        },
        'low': {
            'privacy.policy.firstname': 1,
            'privacy.policy.lastname': 1,
            'privacy.policy.topics': 1,
            'privacy.policy.gender': 1,
            'privacy.policy.birthdate': 5,
            'privacy.policy.address': 5,
            'privacy.policy.currentLocation': 1
        }
    };

    return {
        PP_BASE_URI: _PP_BASE_URI,
        LOG_RATING_URI: _LOG_RATING_URI,
        LOG_RVIEW_URI: _LOG_RVIEW_URI,
        LOG_RCLOSE_URI: _LOG_RCLOSE_URI,
        LOG_TAKE_URI: _LOG_TAKE_URI,
        LOG_SHOW_HIDE_URI: _LOG_SHOW_HIDE_URI,
        DISAMBIGUATE_URI:_DISAMBIGUATE_URI,
        LOG_FACETSCAPE_URI:_LOG_FACETSCAPE_URI,
        LOG_QUERY_ACTIVATED_URI: _LOG_QUERY_ACTIVATED_URI,
        LANGUAGES_AVAILABLE: _LANGUAGES_AVAILABLE,
        VOTE_URL: _VOTE_URL,
        ADD_RATING_URL: _ADD_RATING_URL,
        MCE_ID: _MCE_ID,
        ID_IFRAME_ELEMENT:_ID_IFRAME_ELEMENT,
        STORAGE_URLS: _STORAGE_URLS,
        QUERY_HISTORY_URL: _QUERY_HISTORY_URL,
        BACKSPACE_CODE: _BACKSPACE_CODE,
        SPACE_CODE: _SPACE_CODE,
        ENTER_CODE: _ENTER_CODE,
        POINT_CODE:_POINT_CODE,
        ALLOWED_DELIMITER_VALUES: _ALLOWED_DELIMITER_VALUES,
        FR_STABLE_URL: _FR_STABLE_URL,
        PROXY_URL: _PROXY_URL,
        TIMEOUT: _TIMEOUT,
        PROFILE_URI: _PROFILE_URI,
        PRIVACY_LEVELS: _PRIVACY_LEVELS
    };
})();