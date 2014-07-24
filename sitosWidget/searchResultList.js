// ====================== RESULT LIST ========================================//

/**
 * Create custom handlers for the results' preview
 * In this case, open a fancybox with the url provided in the result.
 * Please make sure to log opening/closing the preview properly (methods:
 * EEXCESS.callBG({method: {parent: 'logging', func: 'openedRecommendation'}, data: url});
 * EEXCESS.callBG({method: {parent: 'logging', func: 'closedRecommendation'}, data: url});
 */
var previewHandler = function(url) {
    $('<a href="' + url + '"></a>').fancybox({
        'type': 'iframe',
        'width': '90%',
        'height': '90%',
        afterShow: function() {
            // log opening the page's preview in the background script
            EEXCESS.callBG({method: {parent: 'logging', func: 'openedRecommendation'}, data: url});
        },
        afterClose: function(evt) {
            // log closing the page's preview in the background script
            EEXCESS.callBG({method: {parent: 'logging', func: 'closedRecommendation'}, data: url});
        }
    }).trigger('click');
};

/*
 * Creates a result list in the provided div-element with the provided handler
 * defined above and sets the correct paths (pathToMedia & pathToLibs)
 */
var rList = EEXCESS.searchResultList($('#test'), {previewHandler: previewHandler, pathToMedia: '../media/', pathToLibs: '../libs/'});

// populate query field initially
EEXCESS.callBG({method: {parent: 'model', func: 'getResults'}, data: null}, function(res) {
    $('#query').val(res.query);
});


// ================= CREATING NEW QUERIES (INPUT FORM FIELD) =================//

/*
 * Creates a new query, when the form is submitted.
 * Removes the current results from the list and adds the loading bar (will be
 * removed, when new results arrive).
 * Tokenizes the terms from the input field and sends them as query.
 */
$('#testForm').submit(function(evt) {
    evt.preventDefault();
    rList.loading(); // show loading bar, will be removed when new results arrive
    // split query terms
    var query_terms = $('#query').val().split(' ');
    var query = [];
    for (var i = 0; i < query_terms.length; i++) {
        var tmp = {
            weight: 1,
            text: query_terms[i]
        };
        query.push(tmp);
    }
    // send query for new results
    EEXCESS.callBG({method: {parent: 'model', func: 'query'}, data: query});
});


// update search input field on new query
EEXCESS.messageListener(
        function(request, sender, sendResponse) {
            if (request.method === 'newSearchTriggered') {
                $('#query').val(request.data.query);
            }
        }
);

$(function(){
    $('#language').on('change',function(){
        EEXCESS.profile.setLanguage($(this).val());
        $('#testForm').submit();
    });

    $.each(EEXCESS.config.LANGUAGES_AVAILABLE, function(key, value) {
        $('#language')
            .append($("<option></option>")
                .attr("value",value)
                .text(value));
    });
    $('#language').val(EEXCESS.profile.getLanguage());
});

$(function(){
    $('ul').on('click', '.buttonTakeToTinyMce', function(evt) {

        var img = $(this).parent().find('img.eexcess_previewIMG').attr('src');
        var title = $(this).parent().find('.eexcess_resContainer>a').text();
        var link = $(this).parent().find('.resCtL a').attr('href');
        var insertion = '<p><img src="' + img + '" alt="' + title + '">';
        insertion += '<p><a href="' + link + '">' + title + '</a></p></p>';
        tinyMCE.get(EEXCESS.config.MCE_ID).execCommand("mceInsertContent", false, insertion);

    });
});

//$(function(){
//    window.setInterval(
//        function(){
//            var selectedText = tinyMCE.activeEditor.selection.getContent({format : "text"});
//            if ( selectedText != "" ){
//                rList.loading();
//                (function(){
//                    var query_terms = selectedText.split(' ');
//                    var query = [];
//                    for (var i = 0; i < query_terms.length; i++) {
//                        var tmp = {
//                            weight: 1,
//                            text: query_terms[i]
//                        };
//                        query.push(tmp);
//                    }
//                    // send query for new results
//                    EEXCESS.callBG({method: {parent: 'model', func: 'query'}, data: query});
//                })();
//            }
//        },
//        2000
//    );
//});
