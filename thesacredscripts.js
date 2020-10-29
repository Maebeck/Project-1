var from = document.getElementById('#origin');
var to = document.getElementById('#destination');
var date = document.getElementById('#start-date');
console.log(to);
console.log(date);
$(document).ready(function () {
    console.log("ready!");


    function skyscannerAPI(from, to, date) {
        //$(".loadingBar1").show();
        console.log(to);
        console.log(date);
        var date1 = moment(date).format("YYYY-MM-DD");         //change date format to be used in flight API
        var dateFormat = moment(date).format("MMM DD, YYYY"); //change Date format to display on webpage
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
                //$(".loadingBar1").hide();
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
                        //$(".loadingBar1").hide(); //hides the loading bar after search complete
    
                    }
    
                }
            }
        }).then(function(){
            $("#flight-table").trigger("update"); // sort table by flight departure date
        });
    }
    $('.searchBtn').on("click", function (event){
        event.preventDefault();
        $('#events').empty();
        pageNo = 1
        var destination = $('#destination').val();
        var origin = $('#origin').val();
        var startDate = $('#start-date');
        var endDate = $('#end-date');
        $(".flight").empty();

        if (origin === "" || destination === "" || startDate === "" || endDate === "") {
            $('#modalEmpty').modal('open');
            $('.modalAccept').focus();
            return false;       
        }
        if (!moment(startDate).isValid() || !moment(endDate).isValid()){
            $('#modalDate').modal('open');
            $(".modalAccept").focus();
            return false;
        }
    skyscannerAPI(origin, destination, startDate);
    })










// test for stuff Sal 












});