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
        EEXCESS.storage.local('privacy.policy.history', 2);
    }
    if(typeof EEXCESS.storage.local('privacy.policy.lastname') === 'undefined') {
        EEXCESS.storage.local('privacy.policy.lastname', 0);
    }
    if(typeof EEXCESS.storage.local('privacy.policy.topics') === 'undefined') {
        EEXCESS.storage.local('privacy.policy.topics', 1);
    }
    if(typeof EEXCESS.storage.local('privacy.policy.uuid') === 'undefined') {
        EEXCESS.storage.local('privacy.policy.uuid', 1);
    }

    var _PP_BASE_URI = 'http://eexcess-dev.joanneum.at/eexcess-privacy-proxy/';
    var _LOG_RATING_URI = _PP_BASE_URI + 'log/rating';
    var _LOG_RVIEW_URI = '/testAjax.php';
    var _LOG_RCLOSE_URI = _PP_BASE_URI + 'log/rclose';
    var _LOG_TAKE_URI = '/testAjax.php';
    var _LOG_SHOW_HIDE_URI = _PP_BASE_URI + 'log/show_hide';
    var _LOG_FACETSCAPE_URI = _PP_BASE_URI + 'log/facetScape';
    var _DISAMBIGUATE_URI = _PP_BASE_URI + 'disambiguate';
    var _LOG_QUERY_ACTIVATED_URI = '/testAjax.php';
    var _LANGUAGES_AVAILABLE = ['de', 'en', 'all'];
    var _VOTE_URL = '/testAjax.php';
    var _ADD_RATING_URL = '/testAjax.php';
    var _MCE_ID = 'text_editor';
    var _ID_IFRAME_ELEMENT = '#tinyMce iframe';

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
        ID_IFRAME_ELEMENT:_ID_IFRAME_ELEMENT
    };
})();