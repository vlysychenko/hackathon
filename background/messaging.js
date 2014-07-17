var EEXCESS = EEXCESS || {};

/**
 * Sends a message to a specific browsertab
 * @memberOf EEXCESS
 * @param {Integer} tabID Identifier of the tab, the message is to be sent to
 * @param {Object} msg The message to send
 * @param {Function} [callback] Function to be called by the receiver
 */
EEXCESS.sendMessage = function(tabID, msg, callback) {
    /// 111
};

/**
 * Sends a message to all tabs
 * @memberOf EEXCESS
 * @param {Object} msg The message to send
 * @param {Function} [callback] Function to be called by the receiver
 */
EEXCESS.sendMsgAll = function(msg, callback) {
    for (l in EEXCESS.listeners) {
        EEXCESS.listeners[l](msg)
    }
};

/**
 * Sends a message to all tabs, except a single one, specified by its identifier
 * @memberOf EEXCESS
 * @param {Integer} tabID Identifier of the tab to be excluded from the receivers
 * @param {Object} msg The message to send
 * @param {Function} [callback] Function to be called by the receiver
 */
EEXCESS.sendMsgOthers = function(tabID, msg, callback) {
    // 111
};