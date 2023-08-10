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
      `;
  weatherDataElement.innerHTML = weatherInfo;

  // Update City Header
  const currentCity = document.getElementById("current-city-name");
  currentCity.innerHTML = data.name;

  // Update Background image
  const currentWeather = data.weather[0].main;
  await updateBackgroundImage(currentWeather);
}

function updateBackgroundImage(weather) {
  const body = document.querySelector("body");
  switch (weather) {
    case "Clear":
      body.style.backgroundImage = 'url("/public/images/sunny.jpg")';
      break;
    case "Clouds":
      body.style.backgroundImage = 'url("/public/images/cloudy.jpg")';
      break;
    case "Rain":
    case "Drizzle":
    case "Thunderstorm":
    case "Snow":
    case "Mist":
    case "Fog":
    case "Haze":
      body.style.backgroundImage = 'url("/public/images/rainy.jpg")';
      break;
    default:
      body.style.backgroundImage = 'url("/public/images/cloudy.jpg")';
      break;
  }
}

getUserLocation();
