$(function () {
    $('#settings_search a').fancybox();

    settings();

    $("div#set_search").click(function () {
        settings()
    });
});

var settings = function () {
    if ($("input[name=selected_text]:checked").val()) {
        EEXCESS.profile.setSwitchTextSelection(true);
    } else EEXCESS.profile.setSwitchTextSelection(false);


    if ($("input[name=type_text]:checked").val()) {
        EEXCESS.profile.setSwitchTextWriting(true);
        $("p.search_options").css("color", "black");
    } else {
        EEXCESS.profile.setSwitchTextWriting(false);
        $("p.search_options").css("color", "#d3d3d3");
    }

    EEXCESS.profile.setSearchTriggerDelimiter($("#set_search input:radio:checked").val());
}