// Currently only 30 search items are shown at a time. This variable saves the current results page to be able to load more items on the fly
var currentPage = 1;

// Used to load additional search pages
var currentKeyword = "";
// Used to store the search results on the client
var searchResultItems;

$(function () {

    // Search button click calls the searchByKeyword function
    $("#searchBtn").click(function () {
        // resets current page
        currentPage = 1;

        // clears existing search results
        $("#resultsSection").html("");

        // saves current keyword
        currentKeyword = $("#keywordTxt").val();

        // calls function to load search items from GitHub
        searchByKeyword(currentKeyword, currentPage);
    });

    // Enables search with 'Enter' key
    $("#keywordTxt").keypress(function (e) {
        if (e.which === 13)
            $('#searchBtn').click();
    });

    // bookmark button click, calls the saveBookmark function
    $("#resultsSection").on("click", ".result-bookmark-btn", function () {
        var selectedId = $(this).parent().attr("id");
        saveBookmark(selectedId);
    });

    // Loads more results when scrolling reach bottom
    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() == $(document).height())
            loadMoreResults();
    });

});



// Sends a post command to the server with the keyword and requested page. Inserts results in the results section div
function searchByKeyword(keyword, page) {
    // get command to gitHub with keyword and page
    $.get("https://api.github.com/search/repositories?q=" + keyword + "&page=" + page, function (result) {
        // saves result items on client
        searchResultItems = result.items;

        // Inserts the result items to the div
        for (var i = 0; i < searchResultItems.length; i++) {
            var currentItem = searchResultItems[i];
            var currentItemDiv = $("<Div>").attr("id", currentItem.id).addClass("result-item").appendTo("#resultsSection");

            $("<span>").text(currentItem.name).addClass("result-title").appendTo(currentItemDiv);
            $("<img>").attr("src", currentItem.owner.avatar_url).addClass("result-avatar").appendTo(currentItemDiv);
            $("<button>").text("Bookmark").addClass("result-bookmark-btn btn btn-primary").appendTo(currentItemDiv);

            $("#resultsSection").append(currentItemDiv);
        }

        // updates current page
        currentPage = page;
    });
}

// Loads more search results when scroll reach bottom
function loadMoreResults() {
    currentPage++;
    searchByKeyword(currentKeyword, currentPage);
}

// Saves a bookmark
function saveBookmark(itemId) {
    // gets the selected bookmark from the saved list
    var selectedBookmarkItem = searchResultItems.find(i => i.id == itemId)

    // converts to Json and sends full bookmark result to server
    var bookmarkItem = JSON.stringify(selectedBookmarkItem)
    $.post("/home/saveBookmark", { itemId, bookmarkItem }, function () {
        $(".result-item[id=" + itemId + "] .btn").text("Saved!").attr("disabled",true);
    });
}

