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

function createForecastData(forecast) {
  // Arrange the forecast data in the format below.
  // while arranging data, we need to add logic to get average data of temperature.
  const forecastData = [
    // day 1
    {
      day: {
        avg_tmp: 35,
      },
      hour: [
        // 0-3
        {},
        // 3-6
        {},
      ],
    },
    // day 2
    {
      day: {
        avg_tmp: 35,
      },
      hour: [
        // 0-3
        {},
        // 3-6
        {},
      ],
    },
  ]
  return forecastData
}

// here
function display5DayForecastData(forecastData) {}

//here
// This function should be invoked from day forecast card in html.
function dayForecastHandler() {
  display3HourForecastData(day, forecastData)
}
