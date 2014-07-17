// Chrome emulator
var chrome = {}

chrome.runtime = (function() {
    return {
        sendMessage:function(extID, message, callback) {
            // ignore extID, we will talk to EEXCESS directly
            var parent = message.method.parent
            var func = message.method.func
            var data = message.data
            if (typeof callback !== 'undefined'){
                EEXCESS[parent][func](null, data, callback)
            } else {
                EEXCESS[parent][func](null, data)
            }         
        }
    }
}());

