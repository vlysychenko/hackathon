console.log($(window).width());
console.log($(window).height());
if(parent){
    EEXCESS = parent.EEXCESS;
}
// ====================== RESULT LIST ========================================//

/**
 * Create custom handlers for the results' preview
 * In this case, open a fancybox with the url provided in the result.
 * Please make sure to log opening/closing the preview properly (methods:
 * EEXCESS.callBG({method: {parent: 'logging', func: 'openedRecommendation'}, data: url});
 * EEXCESS.callBG({method: {parent: 'logging', func: 'closedRecommendation'}, data: url});
 */
var previewHandler = function (url) {

    // log opening the page's preview in the background script
    EEXCESS.callBG({method: {parent: 'logging', func: 'openedRecommendation'}, data: url});
    window.open(url,'_blank');
};

/*
 * Creates a result list in the provided div-element with the provided handler
 * defined above and sets the correct paths (pathToMedia & pathToLibs)
 */
//var rList = EEXCESS.searchResultList($('#test'), {previewHandler: previewHandler, pathToMedia: '../media/', pathToLibs: '../libs/'});

// populate query field initially
EEXCESS.callBG({method: {parent: 'model', func: 'getResults'}, data: null}, function (res) {
    $('#query').val(res.query);
});

$(function () {
    $(document).on('click', '#RS_ResultList ul .buttonTakeToTinyMce', function (evt) {

        var img = $(this).parent().find('img.eexcess_previewIMG').attr('src');
        var title = $(this).parent().find('.eexcess_resContainer>a').text();
        var link = $(this).parent().find('.resCtL a').attr('href');
        var insertion = '<p><img src="' + img + '" alt="' + title + '">';
        insertion += '<p><a href="' + link + '"  target="_blank">' + title + '</a></p></p>';
        parent.$(document).trigger('takeToMce',[{insertion: insertion, link: link}]);
    });
});

$(window).load(function(){
    PROVIDER.buildFacetScape('home', PROVIDER.names.EEXCESS, d3.select("body").select('div#facetScapeViz'), 900, 900);
});

