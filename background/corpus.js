var EEXCESS = EEXCESS || {};

/**
 * Encapsulates functionality for invoking a web worker, in order to create a corpus of terms from an array of text passages
 * @namespace EEXCESS.corpus
 * @type {Object}
 * @returns {Object} Returns a set of functions for obtaining a corpus
 // */

EEXCESS.corpus = (function () {
    return {
        getCorpus: function (tabID, data, callback) {

            var lang = EEXCESS.profile.getLanguage();
            var worker = new Worker('../background/corpus_webWorker.js');

            //Check, whether Web Worker emulator is being used
            if(typeof worker.addEventListener === 'function'){
                worker.addEventListener('message', function (e) {
                    // send corpus back to content script
                    callback(e.data);
                }, false);
            } else {
                worker.onmessage = function(e){
                    callback(e.data);
                };
            }
            worker.postMessage({request: 'tokenize', elements: data, language: lang});
        }
    }
}());