var EEXCESS = EEXCESS || {};

EEXCESS.profile = (function() {
    // retrieve UUID from local storage or create a new one
    var _uuid;
    var _language = 'de';
    if (typeof (Storage) !== 'undefined') {
        _uuid = localStorage.getItem('profile.uuid');
        if (typeof _uuid === 'undefined' || _uuid === null) {
            _uuid = randomUUID();
            localStorage.setItem('profile.uuid', _uuid);
        }
    } else {
        _uuid = randomUUID();
    }

    var applyFirstnamePolicy = function() {
        if (localStorage['privacy.policy.firstname'] === 1) {
            return localStorage['privacy.profile.firstname'];
        }
        return "";
    };

    var applyLastnamePolicy = function() {
        if (localStorage['privacy.policy.lastname'] === 1) {
            return localStorage['privacy.profile.lastname'];
        }
        return "";
    };

    var _interests = function() {
        // TODO: privacy policy
        if (typeof (Storage) !== 'undefined' && localStorage["privacy.policy.topics"] !== 1) {
            var interests = JSON.parse(localStorage.getItem('privacy.profile.topics'));
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
        if (localStorage['privacy.policy.gender'] === 1) {
            return localStorage['privacy.profile.gender'];
        }
        return "";
    };

    var applyBirthdayPolicy = function() {
        switch (localStorage["privacy.policy.birthdate"]) {
            case '2':
                if (localStorage["privacy.profile.birthdate"]) {
                    return localStorage["privacy.profile.birthdate"].split("-")[0].substr(0, 3) + '0s';
                }
                break;
            case '3':
                if (localStorage["privacy.profile.birthdate"]) {
                    return localStorage["privacy.profile.birthdate"].split("-")[0];
                }
                break;
            case '4':
                if (localStorage["privacy.profile.birthdate"]) {
                    var tmp = localStorage["privacy.profile.birthdate"].split("-");
                    return tmp[0] + '-' + tmp[1];
                }
                break;
            case '5':
                if (localStorage["privacy.profile.birthdate"]) {
                    return localStorage["privacy.profile.birthdate"];
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
            zipcode: "",
            city: "",
            line1: "",
            line2: ""
        };
        return address;
    };

    return {
        getUUID: function() {
            return _uuid;
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
                "eexcess-user-profile": {
                    "history": [],
                    "firstname": "sss",
                    "lastname": "test",
                    "gender": und,
                    "birthdate": und,
                    "address": applyAddressPolicy(),
                    "interests": {
                        "interest": []
                    },
                    "context-list": {}
                },
                "uuid": _uuid
            };
            callback(profile);
        }
    };
}());