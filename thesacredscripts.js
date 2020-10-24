$(document).ready(function () {
    console.log("ready!");
// var from = document.getElementById('#origin');
// var to = document.getElementById('#destination');

    function skyscannerAPI(from, to, date1) {
         var from = document.getElementById('#origin');
         var to = document.getElementById('#destination');
        $(".loadingBar1").show();
        //var date1 = moment(date).format("YYYY-MM-DD");         //change date format to be used in flight API
        // var dateFormat = moment(date).format("MMM DD, YYYY"); //change Date format to display on webpage
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/" + from + "-sky/" + to + "-sky/" + date1,
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                "x-rapidapi-key": "15873b5e23mshf948e6e3feda7b2p1db4fajsn89e6f75dccf9"
            }
        }       
        $.ajax(settings).done(function (response) {
            console.log(response);
            if (response.Quotes.length === 0) {
                var row2 = `
                <tr>
                <td>${"No Flights Available From " + from + " To " + to}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                </tr>
                `
                $("#flight-table").append(row2);
                $(".loadingBar1").hide();
            }
            else {
                for (i = 0; i < response.Carriers.length; i++) {
                    if (response.Quotes[0].OutboundLeg.CarrierIds[0] == response.Carriers[i].CarrierId) {
                        var row2 = `
                    <tr>
                    <td>${from}</td>
                    <td>${to}</td>
                    <td>${response.Carriers[i].Name}</td>
                    <td>${dateFormat}</td>
                    <td>${"$" + response.Quotes[0].MinPrice}</td>
                    </tr>
                    `
                        $("#flight-table").append(row2); //appends flight available to the table.
                        $(".loadingBar1").hide(); //hides the loading bar after search complete
    
                    }
    
                }
            }
        }).then(function(){
            $("#flight-table").trigger("update"); // sort table by flight departure date
        });
    }
    $('#Go').on("click", function (event){
        event.preventDefault();
        $('#events').empty();
        pageNo = 1
        var destination = $('#destination').val().trim();
        var origin = $('#origin').val().trim();
        var startDate = $('#start-date').val().trim();
        var endDate = $('#end-date').val().trim();
        $(".flight").empty();

        if (origin === "" || destination === "" || startDate === "" || endDate === "") {
            $('#modalEmpty').modal('open');
            $('.modalAccept').focus();
            return false;       
        }

    })
























});