// ============================ //
//  External API (OpenWeather API)
// ============================ //
async function fetchForecast({ lat, lon }) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}`

  try {
    const res = await fetch(apiUrl)

    if (!res.ok) {
      throw new Error('Failed to fetch data')
    } else {
      const data = await res.json()

      return data
    }
  } catch (err) {
    console.error(err)
  }
}
