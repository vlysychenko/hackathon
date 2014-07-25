var EEXCESS = EEXCESS || {};

EEXCESS.sortTokens = function (corpus, sortFunc) {
    var sortedTokens = [];
    for (var k in corpus) {
        // do not inherit properties / include functions
        if (corpus.hasOwnProperty(k) && typeof corpus[k] !== 'function')
            sortedTokens.push({key: k, value: corpus[k]});
    }
    sortedTokens.sort(sortFunc);
    return sortedTokens;
};

EEXCESS.topKcorpus = function (corpus, k) {
    topK = [];
    var divisor = 1;
    var sorted = EEXCESS.sortTokens(corpus, function (t1, t2) {
        return t2.value['c'] - t1.value['c'];
    });
    // first word
    if (typeof sorted[0] !== 'undefined') {
        divisor = sorted[0].value['c'];
        topK.push({
            "weight": 1,
            "text": sorted[0].key
        });
    }
    for (var i = 1; i < k; i++) {
        if (typeof sorted[i] !== 'undefined') {
            topK.push({
                "weight": (sorted[i].value['c'] / divisor),
                "text": sorted[i].key
            });
        } else {
            break;
        }
    }
    return topK;
};

EEXCESS.triggerQuery = function (textElements, reason) {
    EEXCESS.callBG({method: {parent: 'corpus', func: 'getCorpus'}, data: textElements}, function (result) {
        var query = EEXCESS.topKcorpus(result, 10);
        EEXCESS.callBG({method: {parent: 'model', func: 'query'}, data: {reason: reason, terms: query}});
    });
};