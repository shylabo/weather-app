// ============================ //
//  External API (OpenWeather API)
// ============================ //
async function fetchCurrentWeather({ lat, lon, location }) {
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather";
  if (lat && lon) {
    apiUrl += `?lat=${lat}&lon=${lon}`;
  } else if (location) {
    apiUrl += `?q=${encodeURIComponent(location)}`;
  } else {
    alert("Please enter location");
    throw new Error("Location info is required to fetch current weather");
  }
  apiUrl += `&appid=${OPEN_WEATHER_API_KEY}`;

  try {
    const res = await fetch(apiUrl);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    } else {
      const data = await res.json();
      await updateCurrentLocation(data); // Set Current Location to Local storage
      await updateFavoriteStatus();

      return data;
    }
  } catch (err) {
    alert("Location not found.");
    console.error(err);
  }
}

// ============================ //
//  Action handling
// ============================ //
async function selectFavoriteHandler() {
  const dropdown = document.getElementById("favorites-dropdown");
  const favorites = JSON.parse(localStorage.getItem("favorites"));
  const { latitude, longitude } = favorites.find(
    (favorite) => favorite.name === dropdown.value
  );
  const [currentWeather, forecast] = await Promise.all([
    fetchCurrentWeather({ lat: latitude, lon: longitude }),
    fetchForecast({ lat: latitude, lon: longitude }),
  ]);
  await displayCurrentWeatherData(currentWeather);

  const forecastData = createForecastData(forecast);
  display5dayWeatherData(forecastData);
  initThreeHourRangeArea(forecastData);
}

// ============================ //
//  Browser API & Storage
// ============================ //
async function getUserLocation() {
  function getCurrentPositionAsync() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (err) => reject(err)
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  }

  try {
    const position = await getCurrentPositionAsync();
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const [currentWeather, forecast] = await Promise.all([
      fetchCurrentWeather({ lat, lon }),
      fetchForecast({ lat, lon }),
    ]);

    displayCurrentWeatherData(currentWeather);

    const forecastData = createForecastData(forecast);
    display5dayWeatherData(forecastData);
    initThreeHourRangeArea(forecastData);
  } catch (error) {
    console.error(error.message);
    // Default: Vancouver
    const defaultLatitude = 49.246292;
    const defaultLongitude = -123.116226;
    const currentWeather = await fetchCurrentWeather({
      lat: defaultLatitude,
      lon: defaultLongitude,
    });
    const forecast = await fetchForecast({
      lat: defaultLatitude,
      lon: defaultLongitude,
    });

    displayCurrentWeatherData(currentWeather);

    const forecastData = createForecastData(forecast);
    display5dayWeatherData(forecastData);
    initThreeHourRangeArea(forecastData);
  }
}

function updateCurrentLocation(weatherDataResponse) {
  localStorage.setItem("currentLocation", JSON.stringify(weatherDataResponse));
}

// ============================ //
//  DOM Manipulation
// ============================ //
async function displayCurrentWeatherData(data) {
  // Update Weather Info
  const weatherDataElement = document.getElementById('current-city')
  // const weatherInfo = `
  //       Id: ${data.id} <br>
  //       Country: ${data.sys.country} <br>
  //       City: ${data.name} <br>
  //       Weather: ${data.weather[0].main} <br>
  //       Weather detail: ${data.weather[0].description} <br>
  //       Temperature: ${convertKelvinToCelsius(data.main.temp)}℃ <br>
  //       Humidity: ${data.main.humidity}% <br>
  //       Wind:${data.wind.speed} <br>
  //     `
  // weatherDataElement.innerHTML = weatherInfo
  // Update City Header
  console.log(data)
  const currentCity = document.getElementById('current-city-name');
  currentCity.innerHTML = data.name;
  
  const currentTemp = document.getElementById('current-city-temp');
  currentTemp.innerHTML = `${convertKelvinToCelsius(data.main.temp)}°C`

  const currentTempDetail = document.getElementById('current-weather-detailInfo-temperature-text');
  currentTempDetail.innerHTML = `${convertKelvinToCelsius(data.main.temp)}°C`


    const dateTime = new Date(data.dt * 1000)
    const date = dateTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const dayName = dateTime.toLocaleDateString('en-US', { weekday: 'long' })
    const weatherIcon = data.weather[0].icon;
    const weatherDetail = data.weather[0].description;
    
    //rain calculation 
    let rain;
    if ("rain" in data) {
      rainValue = data.rain["1h"];
      rain = rainValue*100 + " %"
    } else {
        rain = "- -";
    }
    const currentRain = document.getElementById('current-weather-detailInfo-rain-text');
    currentRain.innerHTML = rain;

    //wind calculation
    // unit of wind is m/s and 1m/s = 3.6 km/h
    const windValue = data.wind.speed;
    const wind = (windValue * 3.6).toFixed(1) + "km/h";
    const currentWind = document.getElementById('current-weather-detailInfo-wind-text');
    currentWind.innerHTML = wind;

    //humidity calculation
    const humValue = data.main.humidity;
    const humidity = humValue + "%"
    const currentHumidity = document.getElementById('current-weather-detailInfo-humidity-text');
    currentHumidity.innerHTML = humidity;

    const currentDate = document.getElementById('current-city-date-section--date');
    currentDate.innerHTML = date;
  
    const currentClock = document.getElementById('current-city-date-section--day');
    currentClock.innerHTML = dayName;

    const currentWeatherIcon = document.getElementById('current-city-weather-container-icon');
    const iconurl = "/public/images/icons/"+ weatherIcon + '@2x.png'
    currentWeatherIcon.src = iconurl;

    const currentWeatherState = document.getElementById('current-city-weather-container-state');
    currentWeatherState.innerHTML = weatherDetail;
  // Update Background image
  const currentWeather = data.weather[0].main;
  await updateBackgroundImage(currentWeather);
}

function updateBackgroundImage(weather) {
  const body = document.querySelector('body');
  const currentSectionBG = document.querySelector(".currentSectionBG");

  let backgroundImageUrl;

  switch (weather) {
    case 'Clear':
      body.style.backgroundImage = 'url("/public/images/sunny.jpg")';
      backgroundImageUrl = 'url("/public/images/sunny.jpg")';
      currentSectionBG.style.setProperty('--background-image', backgroundImageUrl);
      break;
    case 'Clouds':
      body.style.backgroundImage = 'url("/public/images/cloudy.jpg")';
      backgroundImageUrl = 'url("/public/images/cloudy.jpg")';
      currentSectionBG.style.setProperty('--background-image', backgroundImageUrl);
      break;
    case 'Rain':
      body.style.backgroundImage = 'url("/public/images/rain.jpg")';
      backgroundImageUrl = 'url("/public/images/rain.jpg")';
      currentSectionBG.style.setProperty('--background-image', backgroundImageUrl);
      break;
    case 'Drizzle':
      body.style.backgroundImage = 'url("/public/images/rainy.jpg")';
      backgroundImageUrl = 'url("/public/images/rainy.jpg")';
      currentSectionBG.style.setProperty('--background-image', backgroundImageUrl);
      break;
    case 'Thunderstorm':
      body.style.backgroundImage = 'url("/public/images/thunder.jpg")';
      backgroundImageUrl = 'url("/public/images/thunder.jpg")';
      currentSectionBG.style.setProperty('--background-image', backgroundImageUrl);      
      break;
    case 'Snow':
      body.style.backgroundImage = 'url("/public/images/snow.jpg")';
      backgroundImageUrl = 'url("/public/images/cloudy.jpg")';
      currentSectionBG.style.setProperty('--background-image', backgroundImageUrl);      
      break;
    case 'Mist':
      body.style.backgroundImage = 'url("/public/images/mist.jpg")';
      backgroundImageUrl = 'url("/public/images/mist.jpg")';
      currentSectionBG.style.setProperty('--background-image', backgroundImageUrl);      
      break;
    case 'Fog':
      body.style.backgroundImage = 'url("/public/images/fog.jpg")';
      backgroundImageUrl = 'url("/public/images/fog.jpg")';
      currentSectionBG.style.setProperty('--background-image', backgroundImageUrl);      
      break;
    case 'Haze':
      body.style.backgroundImage = 'url("/public/images/haze.jpg")';
      backgroundImageUrl = 'url("/public/images/haze.jpg")';
      currentSectionBG.style.setProperty('--background-image', backgroundImageUrl);      
      break;
    default:
      body.style.backgroundImage = 'url("/public/images/default.jpg")';
      backgroundImageUrl = 'url("/public/images/default.jpg")';
      currentSectionBG.style.setProperty('--background-image', backgroundImageUrl);      
      break;
  }
}
// Function to update the clock display
function updateClock() {
  const clockElement = document.getElementById('current-city-clock-section--clock');
  const ampmClock = document.getElementById('current-city-clock-section--ampm');
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format

  const formattedTime = `${formattedHours}:${padZero(minutes)}`;
  clockElement.textContent = formattedTime;
  ampmClock.textContent = ampm;
}

// Function to pad single digits with leading zero
function padZero(value) {
  return value < 10 ? `0${value}` : value;
}

// Update the clock initially and then every minute
updateClock();
setInterval(updateClock, 60000); // Update every minute


getUserLocation()
