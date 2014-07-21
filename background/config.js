var EEXCESS = EEXCESS || {};

(function() {
    localStorage['PP_BASE_URI'] = 'http://eexcess-dev.joanneum.at/eexcess-privacy-proxy/';
    localStorage['VOTE_URL'] = 'http://eexcess/testAjax.php';

    // init profile
    if (!localStorage['profile.uuid']) {
        localStorage['profile.uuid'] = randomUUID();
    }

}());