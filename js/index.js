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
  new google.maps.places.Autocomplete(input, options)
}

async function initializeApp() {
  try {
    await loadGoogleMapsAPI()
    initAutocomplete()
  } catch (err) {
    console.err('Failed to read Google Maps API', err)
  }
}

initializeApp()
