function selectFavoriteHandler() {
  const dropdown = document.getElementById('favorites-dropdown')
  const selectedValue = dropdown.value
  const currentWeather = fetchCurrentWeather({
    location: selectedValue,
  })
  currentWeather.then((result) => displayWeatherData(result))
}

function searchWeatherHandler() {
  const locationInput = document.getElementById('place-search-input')
  const location = locationInput.value

  const currentWeather = fetchCurrentWeather({ location })
  currentWeather.then((result) => displayWeatherData(result))
}

async function fetchCurrentWeather({ location, lat, lon }) {
  let apiUrl = 'https://api.openweathermap.org/data/2.5/weather'
  if (lat && lon) {
    apiUrl += `?lat=${lat}&lon=${lon}`
  } else if (location) {
    apiUrl += `?q=${encodeURIComponent(location)}`
  } else {
    alert('Please enter location')
    throw new Error('Location info is required to fetch current weather')
  }
  apiUrl += `&appid=${OPEN_WEATHER_API_KEY}`

  try {
    const res = await fetch(apiUrl)

    if (!res.ok) {
      throw new Error('Failed to fetch data')
    } else {
      const data = await res.json()
      updateCurrentLocation(data) // Set Current Location to Local storage
      updateFavoriteStatus()

      return data
    }
  } catch (err) {
    alert('Location not found.')
    console.error(err)
  }
}

function displayWeatherData(data) {
  // Update Weather Info
  const weatherDataElement = document.getElementById('current-city')
  const weatherInfo = `
        Id: ${data.id} <br>
        Country: ${data.sys.country} <br>
        City: ${data.name} <br>
        Weather: ${data.weather[0].main} <br>
        Weather detail: ${data.weather[0].description} <br>
        Temperature: ${convertKelvinToCelsius(data.main.temp)}℃ <br>
        Humidity: ${data.main.humidity}% <br>
      `
  weatherDataElement.innerHTML = weatherInfo

  // Update City Header
  const currentCity = document.getElementById('current-city-name')
  currentCity.innerHTML = data.name

  // Update Background image
  const currentWeather = data.weather[0].main
  updateBackgroundImage(currentWeather)
}

function convertKelvinToCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(2)
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        const currentWeather = fetchCurrentWeather({ lat, lon })
        currentWeather.then((result) => displayWeatherData(result))
      },
      (err) => {
        const defaultLocation = 'Vancouver, BC, Canada'
        const currentWeather = fetchCurrentWeather({ location: defaultLocation })
        currentWeather.then((result) => displayWeatherData(result))
      }
    )
  } else {
    console.log('Geolocation is not supported by this browser.')
  }
}

function updateCurrentLocation(weatherDataResponse) {
  localStorage.setItem('currentLocation', JSON.stringify(weatherDataResponse))
}

function updateBackgroundImage(weather) {
  const body = document.querySelector('body')
  switch (weather) {
    case 'Clear':
      body.style.backgroundImage = 'url("/public/images/sunny.jpg")'
      break
    case 'Clouds':
      body.style.backgroundImage = 'url("/public/images/cloudy.jpg")'
      break
    case 'Rain':
    case 'Drizzle':
    case 'Thunderstorm':
    case 'Snow':
    case 'Mist':
    case 'Fog':
    case 'Haze':
      body.style.backgroundImage = 'url("/public/images/rainy.jpg")'
      break
    default:
      body.style.backgroundImage = 'url("/public/images/cloudy.jpg")'
      break
  }
}

getUserLocation()
