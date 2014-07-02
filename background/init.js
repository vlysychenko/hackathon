var EEXCESS = EEXCESS || {};

(function() {
    // init privacy proxy url for logging calls
    EEXCESS.storage.local('PP_BASE_URI', 'http://eexcess-dev.joanneum.at/eexcess-privacy-proxy/');

    // init profile
    if (!EEXCESS.storage.local('profile.uuid')) {
        EEXCESS.storage.local('profile.uuid', randomUUID());
    }
}());