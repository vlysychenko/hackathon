var EEXCESS = EEXCESS || {};

EEXCESS.profile = (function() {
    // retrieve UUID from local storage or create a new one
    var _uuid;
    var _language = 'de';
    _uuid = EEXCESS.storage.local('privacy.profile.uuid');
    if (typeof _uuid === 'undefined' || _uuid === null) {
        _uuid = randomUUID();
        EEXCESS.storage.local('privacy.profile.uuid', _uuid);
    }

    var applyFirstnamePolicy = function() {
        if (EEXCESS.storage.local('privacy.policy.firstname') === 1 || "1") {
            return EEXCESS.storage.local('privacy.profile.firstname');
        }
        return "";
    };

    var applyLastnamePolicy = function() {
        if (EEXCESS.storage.local('privacy.policy.lastname') === 1 || "1") {
            return EEXCESS.storage.local('privacy.profile.lastname');
        }
        return "";
    };

    var _interests = function() {
        if (EEXCESS.storage.local("privacy.policy.topics") !== 1 && typeof EEXCESS.storage.local("privacy.profile.topics") !== 'undefined') {
            var interests = JSON.parse(EEXCESS.storage.local('privacy.profile.topics'));
            if ($.isArray(interests)) {
                // TODO: real weights
                var weighted = [];
                for (var i = 0, len = interests.length; i < len; i++) {
                    if (interests[i]['policy'] === 1) {
                        if (typeof interests[i]['uri'] !== undefined && interests[i]['uri'] !== '') {
                            weighted.push({"text": interests[i]['label'], "weight": "1.0", "uri": interests[i]['uri']});
                        } else {
                            weighted.push({"text": interests[i]['label'], "weight": "1.0"});
                        }
                    }
                }
                return weighted;
            }
        }
        return [];
    };

    var applyGenderPolicy = function() {
        if (EEXCESS.storage.local('privacy.policy.gender') === 1 || "1") {
            return EEXCESS.storage.local('privacy.profile.gender');
        }
        return "";
    };
    
    var applyUuidPolicy = function() {
        if (JSON.parse(EEXCESS.storage.local('privacy.policy.uuid')) === 1) {
            return _uuid;
        }
        return "";
    };

    var applyBirthdayPolicy = function() {
        switch (EEXCESS.storage.local("privacy.policy.birthdate")) {
            case '2':
                if (EEXCESS.storage.local("privacy.profile.birthdate")) {
                    return EEXCESS.storage.local("privacy.profile.birthdate").split("-")[0].substr(0, 3) + '0';
                }
                break;
            case '3':
                if (EEXCESS.storage.local("privacy.profile.birthdate")) {
                    return EEXCESS.storage.local("privacy.profile.birthdate").split("-")[0];
                }
                break;
            case '4':
                if (EEXCESS.storage.local("privacy.profile.birthdate")) {
                    var tmp = EEXCESS.storage.local("privacy.profile.birthdate").split("-");
                    return tmp[0] + '-' + tmp[1] + '-01';
                }
                break;
            case '5':
                if (EEXCESS.storage.local("privacy.profile.birthdate")) {
                    return EEXCESS.storage.local("privacy.profile.birthdate");
                }
                break;
        }
        return "";
    };

    var setAddressValue = function(field, address) {
        address[field] = "42";
    };

    var applyAddressPolicy = function() {
        var address = {
            country: "",
            zipCode: "",
            city: "",
            line1: "",
            line2: ""
        };
        var level = EEXCESS.storage.local('privacy.policy.address');
        if (level > 1) {
            setAddressValue('country', address);
        }
        if (level > 2) {
            setAddressValue('zipCode', address);
        }
        if (level > 3) {
            setAddressValue('city', address);
        }
        if (level > 4) {
            setAddressValue('line1', address);
            setAddressValue('line2', address);
        }
        return address;
    };

    return {
        getUUID: function() {
            return applyUuidPolicy();
        },
        getLanguage: function(){
            return _language;
        },
        setLanguage: function(lang){
            _language = lang;
        },
        getProfile: function(callback) {
            var und;
            var profile = {
                "history": [],
                "firstName": 'sss',
                "lastName": 'test',
                "gender": und,
                "birthDate": und,
                "address": applyAddressPolicy(),
                "interests": {
                    "interest": []
                },
                "contextKeywords": {},
                "uuid": applyUuidPolicy()
            };
            callback(profile);
        }
    };
}());