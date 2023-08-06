// ============================ //
//  External API (Google Place API)
// ============================ //
async function loadGoogleMapsAPI() {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_GEO_API_KEY}&libraries=places&callback=initAutocomplete`
    script.onload = resolve
    document.head.appendChild(script)
  })
}

async function initAutocomplete() {
  const input = document.getElementById('place-search-input')
  const options = {
    fields: ['address_components', 'geometry', 'icon', 'name'],
    strictBounds: false,
    types: ['geocode'],
  }

  const autocomplete = await new google.maps.places.Autocomplete(input, options)

  autocomplete.addListener('place_changed', async () => {
    try {
      const place = autocomplete.getPlace()

      if (!place.geometry || !place.geometry.location) {
        throw new Error('Location not found.')
      }

      const lat = place.geometry.location.lat()
      const lon = place.geometry.location.lng()

      const [currentWeather, forecast] = await Promise.all([
        fetchCurrentWeather({ lat, lon }),
        fetchForecast({ lat, lon }),
      ])

      displayCurrentWeatherData(currentWeather)
      // TODO: Display Result
      console.log('forecast invoked from input area', forecast)
    } catch (err) {
      console.error(err.message)
    }
  })
}

async function initializeApp() {
  try {
    await loadGoogleMapsAPI()
    await initAutocomplete()
  } catch (err) {
    console.err('Failed to read Google Maps API', err)
  }
}

initializeApp()
