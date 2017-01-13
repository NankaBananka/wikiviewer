// API_url example "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&generator=search&exsentences=1&exlimit=max&exintro=1&explaintext=1&gsrsearch=John+Doe";

var API_url = "https://en.wikipedia.org/w/api.php?"; //endpoint of the MediaWiki web service API

//parameters for ajax query, look in API documentation here: "https://www.mediawiki.org/wiki/API:Main_page"
var parameters = {
    action: "query",
    format: "json",
    prop: "extracts",
    generator: "search",
    exsentences: "1",
    exlimit: "max",
    exintro: "1",
    explaintext: "1"
}


//helping function for building query url (endpoint + all parameters)
function buildURL() {
    API_url += $.param(parameters);
}


//building full url for query  
function buildQuery() {
    var userQuery = $("#inputtext").val(); //taking value of user search from input
    parameters.gsrsearch = userQuery; //adding parameter grssearch to object "parameters"
    buildURL(); //building full ajax query
    console.log(parameters);
//    console.log(API_url);
}

//AJAX request
function makeQuery() { 
    console.log("making ajax request");
    $.ajax({
        beforeSend: function() {
            $("#working").fadeIn(500);
            console.log("log status")
        },
        url: API_url,
        dataType: 'jsonp', //allowing cross-origin HTTP request
        type: 'GET',
        success: function(data) {
            if ((data.hasOwnProperty("query")) && (data.query.hasOwnProperty("pages"))) {
                //if request was succesful and results contain data (wiki pages) show data to user
                addNodes(data.query.pages);
                console.log("print pages");
            } else{
                //if results don't contain data we need - alert
                $("#error").delay(1500).fadeIn(1000);
                console.log("Error");
            }
        },
        complete: function() {
            $("#working").fadeOut(500);
            console.log("next log status")
        } 
    });
}

//adding nodes to document
function addNodes(obj){  
    $.each(obj, function(key){
        var pageId = key,
            title = obj[key].title,
            extract = obj[key].extract;
        $("#results").append("<div class='panel panel-default result-row'>"
                             + "<div class='panel-heading'>" + "<a href='http://en.wikipedia.org/?curid=" + pageId + "' target='_blank'>" + title + "</a>"+ "</div>"
                             + "<div class='panel-body'>" + extract + "</div>"
                             + "</div>"); 
        
        $(".result-row").delay(1000).fadeIn(1000, function() {})
    })
    
}

//starting neccesary functions
function mainwork() {
    $("#results").empty(); //deleting previous results: element "results" contains all nodes we added with function addNodes
    $("#error").css("display", "none");
    buildQuery();
    makeQuery();

}



//===================================HANDLERS===================================================

//handlers working after page was onloaded
$(document).ready(function () {

    //turning on animation for clicking on arrow (made in queue):
    $("#down").click(function() {
        //fadeout all elements on start page
        $("#intro").queue(function() {
            $(this).fadeOut("slow", function() {})
        }).dequeue()
        
        .delay(300)
        
        //fading in form for text input
        .queue(function() {
            $("#inputtext").fadeIn("slow", function() {})
        }).dequeue()
        
        //animation for text input
        .queue(function() {
            $("#inputtext").animate({
                width: "100%",
                borderRadius: "2px"
            }, 500, function(){})
        })            
    })
            
    //start working after keydown "enter" (which code is "13"):
    $("#inputtext").keydown(function (event) {
        if (event.which === 13) {
            //animation - changing position of inputtext
            $("#inputform").delay(500).animate({
                    top: "-280"
                }, "slow", function(){})
            
            //fading in "cancel" link which reload page if user wants
            .promise().done(function() {
                mainwork()
            })
                   
            .promise().done(function() {
                $("#cancel").delay(3000).show(500, function() {
                    $(this).css("visibility", "visible")
                });
            })
            

        }
    });
      
    //handler for reloading page
    $("#cancel").click(function() {
        location.href = location.href;
    })
    
});





