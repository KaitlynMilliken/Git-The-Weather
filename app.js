var apiKey = "9f30d37e31cf137d1d0a62d41457f99f";

var getData = function(city){
    let weatherCall = fetch("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey + "");

    weatherCall.then(Response => {
        return Response.json();
    }).then(weather => {
        let iconLink = "http://openweathermap.org/img/wn/" + weather.weather[0].icon + ".png";
        var d = new Date();
        var date = d.getDate() + "/" + (d.getMonth()+1) +  "/" +  d.getFullYear();
        var citySearch = document.createElement("button");
        citySearch.innerText = weather.name;
        citySearch.classList.add("btn", "btn-secondary", "previousCity");

        console.log(weather);

        $("#city").text(weather.name + " (" + date + ")");
        $("#temp").text(weather.main.temp + "℉");
        $("#wind").text(weather.wind.speed + " MPH");
        $("#humidity").text(weather.main.humidity + "%");
        $("#weatherIcon").attr("src", iconLink);
        $(".searchHistory").append(citySearch);

        let weatherObj = {
            "lat": weather.coord.lat,
            "lon": weather.coord.lon
        }

        generateFiveDayForecast(weatherObj);


    }).catch((err) => {
        console.log(err);
    });
}; 

var generateFiveDayForecast = function(data){
    $(".five-day-forecast").children().remove();

    let weatherString = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.lat + "&lon=" + data.lon +"&exclude=current,minutely,hourly,alerts&units=imperial&appid=" + apiKey;

    fetch(weatherString).then(Response => {
        return Response.json();
    }).then(fiveDay => {
        var d = new Date();
        let dateAdd = 1;

        for(let i = 0; i < 5; i++){
            var date = d.getDate() + "/" + (d.getMonth()+ dateAdd) +  "/" +  d.getFullYear();
            let showDate = document.createElement("h3");
            let temp = document.createElement("span");
            let wind = document.createElement("span");
            let humidity = document.createElement("span");
            let container = document.createElement("div");

            container.classList.add("day", "col", "day" + i);

            $(".five-day-forecast").append(container);

            console.log(fiveDay.daily[i]);

            temp.innerText = "Temp: " + fiveDay.daily[i].temp.day;
            wind.innerText = "Wind: " + fiveDay.daily[i].wind_speed + " MPH";
            humidity.innerText = "Humidity: " + fiveDay.daily[i].humidity;
            showDate.innerText = date;

           $(".day" + i).append(showDate);
           $(".day" + i).append(temp);
           $(".day" + i).append(wind);
           $(".day" + i).append(humidity);

           dateAdd = dateAdd + 1;
        }

        console.log(fiveDay);
    }).catch((err) => {
        console.log(err);
    });
}

getData("Charlotte");

$(".submit").on('click', function(){
    let userData = $("#userCity").val();
    if(userData){
        getData(userData);
    } else{
        console.log("Please enter city");
    }
});

$(".searchHistory").on("click", ".previousCity", () => {
    let city = this.event.target.innerText;
    getData(city);
});