var EEXCESS = EEXCESS || {};

EEXCESS.profile = (function() {
    // retrieve UUID from local storage or create a new one
    var _uuid;
    var _language = EEXCESS.storage.local('privacy.profile.language')
        ? EEXCESS.storage.local('privacy.profile.language')
        : 'de';
    var _numResults = 60;
    var _origin = 'SITOS';

    var _searchTriggerDelimiter = (typeof EEXCESS.storage.local('privacy.profile.searchTriggerDelimiter') !== 'undefined')
        ? EEXCESS.storage.local('privacy.profile.searchTriggerDelimiter')
        : 'sentence';
    var _switchTextSelection = (typeof EEXCESS.storage.local('privacy.profile.switchTextSelection') !== 'undefined')
        ? EEXCESS.storage.local('privacy.profile.switchTextSelection')
        : true;
    var _switchTextWriting = (typeof EEXCESS.storage.local('privacy.profile.switchTextWriting') !=='undefined')
        ? EEXCESS.storage.local('privacy.profile.switchTextWriting')
        : true;

    _uuid = EEXCESS.storage.local('privacy.profile.uuid');
    if (typeof _uuid === 'undefined' || _uuid === null) {
        _uuid = randomUUID();
        EEXCESS.storage.local('privacy.profile.uuid', _uuid);
    }

    var applyFirstnamePolicy = function() {
        if (EEXCESS.storage.local('privacy.policy.firstname') == "1") {
            return EEXCESS.storage.local('privacy.profile.firstname');
        }
        return "";
    };

    var applyLastnamePolicy = function() {
        if (EEXCESS.storage.local('privacy.policy.lastname') == "1") {
            return EEXCESS.storage.local('privacy.profile.lastname');
        }
        return "";
    };

    var _interests = function() {
        if (EEXCESS.storage.local("privacy.policy.topics") == "1" && typeof EEXCESS.storage.local("privacy.profile.topics") !== 'undefined') {
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
        if (EEXCESS.storage.local('privacy.policy.gender') == "1") {
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
        address[field] = EEXCESS.storage.local('privacy.profile.address.' + field);;
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

    // obtain list of selected sources
    var getPartnerList = function() {
        var partners = EEXCESS.storage.local('selected_sources');
        if(typeof partners === 'undefined') {
            return [{"systemId":"Europeana"},{"systemId":"Mendeley"},{"systemId":"ZBW"},{"systemId":"KIMCollect"}];
        } else {
            partners = JSON.parse(partners);
            var partnerList = [];
            $.each(partners, function(index,value) {
                partnerList.push({"systemId":value});
            });
            return partnerList;
        }
    };

    var applyLocationPolicy = function() {
        if(EEXCESS.storage.local('privacy.policy.currentLocation')
            && JSON.parse(EEXCESS.storage.local('privacy.policy.currentLocation')) === 1) {
            return JSON.parse(EEXCESS.storage.local('privacy.profile.currentLocation'));
        } else {
            return [];
        }
    };

    var clearProfile = function(){
        [
            //'language',
            //'searchTriggerDelimiter',
            //'switchTextSelection',
            //'switchTextWriting',
            'uuid',
            'firstname',
            'lastname',
            'topics',
            'gender',
            'birthdate',
            'address.country',
            'address.zipCode',
            'address.city',
            'address.line1',
            'address.line2'
        ].forEach(function(value){
                EEXCESS.storage.localRemove('privacy.profile.' + value);
            });
    };

    var _loadProfile = function(){
        $.ajax({
            url: EEXCESS.config.PROFILE_URI,
            type: 'GET',
            dataType: 'json',
            success: function (data){
                clearProfile();
                _uuid = data['uuid'];
                if (typeof _uuid === 'undefined' || _uuid === null) {
                    _uuid = randomUUID();
                }
                EEXCESS.storage.local('privacy.profile.uuid', _uuid);
                EEXCESS.storage.local('privacy.profile.firstname', data['firstName']);
                EEXCESS.storage.local('privacy.profile.lastname', data['lastName']);
                if((typeof data['interests'] !== 'undefined')
                        && $.isArray(data['interests'])){
                    var topics = [];
                    data['interests'].forEach(function(interest){
                        var topic = {policy: EEXCESS.storage.local('privacy.level') === 'low' ? 1 : 0};
                        topic['label'] = interest['text'];
                        topics.push(topic);
                    });
                    EEXCESS.storage.local("privacy.profile.topics", JSON.stringify(topics));
                }
                EEXCESS.storage.local('privacy.profile.gender', data['gender']);
                EEXCESS.storage.local("privacy.profile.birthdate", data['birthDate']);
                if( typeof data['address'] !== 'undefined'){
                    EEXCESS.storage.local("privacy.profile.address.country", data['address']['country']);
                    EEXCESS.storage.local("privacy.profile.address.zipCode", data['address']['zipCode']);
                    EEXCESS.storage.local("privacy.profile.address.city", data['address']['city']);
                    EEXCESS.storage.local("privacy.profile.address.line1", data['address']['line1']);
                    EEXCESS.storage.local("privacy.profile.address.line2", data['address']['line2']);
                }
                console.log('Loaded profile');
            }
        });
    };

    var clearPrivacySettings = function(){
        [
            'privacy.policy.firstname',
            'privacy.policy.lastname',
            'privacy.policy.topics',
            'privacy.policy.gender',
            'privacy.policy.birthdate',
            'privacy.policy.address',
            'privacy.policy.uuid',
            'privacy.policy.currentLocation'
        ].forEach(function(value){
                EEXCESS.storage.local(value, 0);
            });
    };

    var _setPrivacyLevel = function(level){
        EEXCESS.storage.local('privacy.level', level);
        if(typeof EEXCESS.config.PRIVACY_LEVELS[level] === 'undefined'){
            return;
        }
        var levelSettings = EEXCESS.config.PRIVACY_LEVELS[level];
        clearPrivacySettings();
        for (var key in levelSettings){
            EEXCESS.storage.local(key,levelSettings[key]);
        }
        if(typeof EEXCESS.storage.local("privacy.profile.topics") !== 'undefined'){
            var interests = JSON.parse(EEXCESS.storage.local('privacy.profile.topics'));
            if ($.isArray(interests)) {
                for (var i = 0, len = interests.length; i < len; i++) {
                    interests[i]['policy'] = level === 'low' ? 1 : 0;
                }
                EEXCESS.storage.local("privacy.profile.topics", JSON.stringify(interests));
            }
        }
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
            EEXCESS.storage.local('privacy.profile.language', _language);
        },
        setNumResults: function(num){
            _numResults = num;
        },
        getSearchTriggerDelimiter: function(){
            return _searchTriggerDelimiter;
        },
        setSearchTriggerDelimiter: function(delimiter){
            if(EEXCESS.config.ALLOWED_DELIMITER_VALUES.indexOf(delimiter) != -1){
                _searchTriggerDelimiter = delimiter;
                EEXCESS.storage.local('privacy.profile.searchTriggerDelimiter', _searchTriggerDelimiter);
            }
        },

        getSwitchTextSelection: function(){
            return _switchTextSelection;
        },

        setSwitchTextSelection: function(tumbler){
            _switchTextSelection = tumbler;
            EEXCESS.storage.local('privacy.profile.switchTextSelection', _switchTextSelection);
        },

        getSwitchTextWriting: function(){
            return _switchTextWriting;
        },

        setSwitchTextWriting: function(tumbler){
            _switchTextWriting = tumbler;
            EEXCESS.storage.local('privacy.profile.switchTextWriting',_switchTextWriting);
        },

        getProfile: function(callback) {
            var profile = {
                //"history": [],
                "partnerList": getPartnerList(),
                "firstName": applyFirstnamePolicy(),
                "lastName": applyLastnamePolicy(),
                "gender": applyGenderPolicy(),
                "birthDate": applyBirthdayPolicy(),
                "address": applyAddressPolicy(),
                "interests": _interests(),
                "contextKeywords": {},
                //"uuid": applyUuidPolicy(),
                "userLocations": applyLocationPolicy(),
                "numResults": _numResults
                //"origin": _origin
            };
            callback(profile);
        },

        loadProfile: _loadProfile,

        setPrivacyLevel: _setPrivacyLevel
    };
}());