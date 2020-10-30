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
        var startDate = $('#start-date').val();
        var endDate = $('#end-date').val();
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

    function initPage() {
        const inputEl = document.getElementById("city-input");
        const searchEl = document.getElementById("search-button");
        const clearEl = document.getElementById("clear-history");
        const nameEl = document.getElementById("city-name");
        const currentPicEl = document.getElementById("current-pic");
        const currentTempEl = document.getElementById("temperature");
        const currentHumidityEl = document.getElementById("humidity");
        4;
        const currentWindEl = document.getElementById("wind-speed");
        const currentUVEl = document.getElementById("UV-index");
        const historyEl = document.getElementById("history");
        let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
        console.log(searchHistory);
      
        const APIKey = "c9a9ed03a355403f4cb9a36e931c0b4a";
        //  When search button is clicked, read the city name typed by the user
      
        function getWeather(cityName) {
          //  Using saved city name, execute a current condition get request from open weather map api
          let queryURL =
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            cityName +
            "&appid=" +
            APIKey;
          axios.get(queryURL).then(function (response) {
            console.log(response);
      
            const currentDate = new Date(response.data.dt * 1000);
            console.log(currentDate);
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            nameEl.innerHTML =
              response.data.name + " (" + month + "/" + day + "/" + year + ") ";
            let weatherPic = response.data.weather[0].icon;
            currentPicEl.setAttribute(
              "src",
              "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png"
            );
            currentPicEl.setAttribute("alt", response.data.weather[0].description);
            currentTempEl.innerHTML =
              "Temperature: " + k2f(response.data.main.temp) + " &#176F";
            currentHumidityEl.innerHTML =
              "Humidity: " + response.data.main.humidity + "%";
            currentWindEl.innerHTML =
              "Wind Speed: " + response.data.wind.speed + " MPH";
            let lat = response.data.coord.lat;
            let lon = response.data.coord.lon;
            let UVQueryURL =
              "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" +
              lat +
              "&lon=" +
              lon +
              "&appid=" +
              APIKey +
              "&cnt=1";
            axios.get(UVQueryURL).then(function (response) {
              let UVIndex = document.createElement("span");
              UVIndex.setAttribute("class", "badge badge-danger");
              UVIndex.innerHTML = response.data[0].value;
              currentUVEl.innerHTML = "UV Index: ";
              currentUVEl.append(UVIndex);
            });
            //  Using saved city name, execute a 5-day forecast get request from open weather map api
            let cityID = response.data.id;
            let forecastQueryURL =
              "https://api.openweathermap.org/data/2.5/forecast?id=" +
              cityID +
              "&appid=" +
              APIKey;
            axios.get(forecastQueryURL).then(function (response) {
              //  Parse response to display forecast for next 5 days underneath current conditions
              console.log(response);
              const forecastEls = document.querySelectorAll(".forecast");
              for (i = 0; i < forecastEls.length; i++) {
                forecastEls[i].innerHTML = "";
                const forecastIndex = i * 8 + 4;
                const forecastDate = new Date(
                  response.data.list[forecastIndex].dt * 1000
                );
                const forecastDay = forecastDate.getDate();
                const forecastMonth = forecastDate.getMonth() + 1;
                const forecastYear = forecastDate.getFullYear();
                const forecastDateEl = document.createElement("p");
                forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                forecastDateEl.innerHTML =
                  forecastMonth + "/" + forecastDay + "/" + forecastYear;
                forecastEls[i].append(forecastDateEl);
                const forecastWeatherEl = document.createElement("img");
                forecastWeatherEl.setAttribute(
                  "src",
                  "https://openweathermap.org/img/wn/" +
                    response.data.list[forecastIndex].weather[0].icon +
                    "@2x.png"
                );
                forecastWeatherEl.setAttribute(
                  "alt",
                  response.data.list[forecastIndex].weather[0].description
                );
                forecastEls[i].append(forecastWeatherEl);
                const forecastTempEl = document.createElement("p");
                forecastTempEl.innerHTML =
                  "Temp: " +
                  k2f(response.data.list[forecastIndex].main.temp) +
                  " &#176F";
                forecastEls[i].append(forecastTempEl);
                const forecastHumidityEl = document.createElement("p");
                forecastHumidityEl.innerHTML =
                  "Humidity: " +
                  response.data.list[forecastIndex].main.humidity +
                  "%";
                forecastEls[i].append(forecastHumidityEl);
              }
            });
          });
        }
      
        searchEl.addEventListener("click", function () {
          const searchTerm = inputEl.value;
          getWeather(searchTerm);
          searchHistory.push(searchTerm);
          localStorage.setItem("search", JSON.stringify(searchHistory));
          renderSearchHistory();
        });
      
        clearEl.addEventListener("click", function () {
          searchHistory = [];
          renderSearchHistory();
        });
      
        function k2f(K) {
          return Math.floor((K - 273.15) * 1.8 + 32);
        }
      
        function renderSearchHistory() {
          historyEl.innerHTML = "";
          for (let i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click", function () {
              getWeather(historyItem.value);
            });
            historyEl.append(historyItem);
          }
        }
      
        renderSearchHistory();
        if (searchHistory.length > 0) {
          getWeather(searchHistory[searchHistory.length - 1]);
        }
      }
      initPage();
      








// test for stuff Sal 












});