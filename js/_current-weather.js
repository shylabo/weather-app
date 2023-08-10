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
  const weatherDataElement = document.getElementById("current-city");
  const weatherInfo = `
        Id: ${data.id} <br>
        Country: ${data.sys.country} <br>
        City: ${data.name} <br>
        Weather: ${data.weather[0].main} <br>
        Weather detail: ${data.weather[0].description} <br>
        Temperature: ${convertKelvinToCelsius(data.main.temp)}℃ <br>
        Humidity: ${data.main.humidity}% <br>
        Wind:${data.wind.speed} <br>
      `
  weatherDataElement.innerHTML = weatherInfo
  // Update City Header
  const currentCity = document.getElementById("current-city-name");
  currentCity.innerHTML = data.name;

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


getUserLocation()
