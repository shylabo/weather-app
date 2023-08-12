// ============================ //
//  External API (Google Place API)
// ============================ //
async function loadGoogleMapsAPI() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_GEO_API_KEY}&libraries=places&callback=initAutocomplete`;
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

// Search
async function initAutocomplete() {
  const input = document.getElementById("place-search-input");
  const options = {
    fields: ["address_components", "geometry", "icon", "name"],
    strictBounds: false,
    types: ["geocode"],
  };
  const autocomplete = await new google.maps.places.Autocomplete(
    input,
    options
  );

  autocomplete.addListener("place_changed", async () => {
    try {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        throw new Error("Location not found.");
      }

      const lat = place.geometry.location.lat();
      const lon = place.geometry.location.lng();

      const [currentWeather, forecast] = await Promise.all([
        fetchCurrentWeather({ lat, lon }),
        fetchForecast({ lat, lon }),
      ]);

      // set searched city in currentCityName in LocalStorage to use in the entire app.
      const searchedCityName = place.address_components[0].long_name;
      updateCurrentCityName(searchedCityName);
      updateFavoriteStatus();

      displayCurrentWeatherData(currentWeather, searchedCityName);

      const forecastData = createForecastData(forecast);

      display5dayWeatherData(forecastData);
      initThreeHourRangeArea(forecastData);

      // change the display of  3 hour range forecast on clicking the daily forecast card
      const dailyCardElements = document.getElementsByClassName("daily-card");
      for (let i = 0; i < dailyCardElements.length; i++) {
        dailyCardElements[i].addEventListener("click", () => {
          display3HourRangeForecastData(forecastData, i);
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  });
}

// ============================ //
//  Browser API (Geo location)
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
    // Case: We can use actual user location data
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const [currentWeather, forecast] = await Promise.all([
      fetchCurrentWeather({ lat, lon }),
      fetchForecast({ lat, lon }),
    ]);

    // set LocalStorage
    updateCurrentCityName(currentWeather.name);

    displayCurrentWeatherData(currentWeather);

    const forecastData = createForecastData(forecast);
    display5dayWeatherData(forecastData);
    initThreeHourRangeArea(forecastData);
  } catch (error) {
    console.error(error.message);
    // Case: We can NOT use actual user location data (permission denied)
    // In this case, it'll fetch data using default(Vancouver) location
    const defaultLatitude = 49.246292;
    const defaultLongitude = -123.116226;
    const [currentWeather, forecast] = await Promise.all([
      fetchCurrentWeather({
        lat: defaultLatitude,
        lon: defaultLongitude,
      }),
      fetchForecast({
        lat: defaultLatitude,
        lon: defaultLongitude,
      }),
    ]);

    // set LocalStorage
    updateCurrentCityName(currentWeather.name);

    displayCurrentWeatherData(currentWeather);

    const forecastData = createForecastData(forecast);
    display5dayWeatherData(forecastData);
    initThreeHourRangeArea(forecastData);
  }
}

async function initializeApp() {
  try {
    await getUserLocation();
    await loadGoogleMapsAPI();
    await initAutocomplete();
  } catch (err) {
    console.err("Failed to read Google Maps API", err);
  }
}

initializeApp();
