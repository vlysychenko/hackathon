var EEXCESS = EEXCESS || {};
EEXCESS.extID = 42; // we don't use it anyway
EEXCESS.listeners = [];

/**
 * Sends a message to the background script
 * @memberOf EEXCESS
 * @param {Object} message The message to send
 * @param {Function} callback Function to be called by the receiver
 */
EEXCESS.callBG = function(message, callback) {
    if (typeof callback !== 'undefined') {
        chrome.runtime.sendMessage(EEXCESS.extID, message, callback);
    } else {
        chrome.runtime.sendMessage(EEXCESS.extID, message);
    }
};

/**
 * Listens for incoming messages
 * @param {Function} callback a function that looks like this: 
function(any message, MessageSender sender, function sendResponse) {...};
 */
EEXCESS.messageListener = function(callback, category) {
    if(typeof category === 'undefined'){
        EEXCESS.listeners.push(callback);
    }else{
        EEXCESS.listeners[category] = EEXCESS.listeners[category] || [];
        EEXCESS.listeners[category].push(callback);
    }
};
