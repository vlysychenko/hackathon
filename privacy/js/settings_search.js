$(function () {
    $('#settings_search a').fancybox({
        afterShow: function(){
            $("input[name=selected_text]").prop("checked", EEXCESS.profile.getSwitchTextSelection());
            $("input[name=type_text]").prop("checked", EEXCESS.profile.getSwitchTextWriting());
            $("#set_search input:radio").each(function(){
                $(this).prop("checked",EEXCESS.profile.getSearchTriggerDelimiter() === $(this).val());
            });
        }
    });

    $("div#set_search").click(function () {
        settings()
    });
});

var settings = function () {
    if ($("input[name=selected_text]:checked").val()) {
        EEXCESS.profile.setSwitchTextSelection(true);
    } else EEXCESS.profile.setSwitchTextSelection('');


    if ($("input[name=type_text]:checked").val()) {
        EEXCESS.profile.setSwitchTextWriting(true);
        $("p.search_options").css("color", "black");
    } else {
        EEXCESS.profile.setSwitchTextWriting('');
        $("p.search_options").css("color", "#d3d3d3");
    }

    EEXCESS.profile.setSearchTriggerDelimiter($("#set_search input:radio:checked").val());
}