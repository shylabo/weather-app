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


async function createForecastData(data) {
  const dayData = [];
  let firstDay = true;

  for (const item of data.list) {
    const dateTime = new Date(item.dt * 1000); 
    const date = dateTime.toLocaleDateString(undefined, {month: 'short', day: 'numeric' });
    const dayName = dateTime.toLocaleDateString(undefined, { weekday: 'short' });
    const temperature = item.main.temp;
    const weatherStatue = item.weather[0].main;
    const weatherIcon = item.weather[0].icon;

    if (!firstDay) {
      const existingDay = dayData.find(day => day.date === date);
      if (existingDay) {
        existingDay.temperatures.push(temperature);
      } else {
        dayData.push({
          date: date,
          day: dayName,
          temperatures: [temperature],
          weatherStatue: weatherStatue,
          weatherIcon:weatherIcon
        });
      }
    } else {
      firstDay = false;
    }
  }

  for (const day of dayData) {
    const lowestTemp = Math.min(...day.temperatures);
    const highestTemp = Math.max(...day.temperatures);
    
    const lowestTempCelsius = (lowestTemp - 273.15).toFixed(0); 
    const highestTempCelsius = (highestTemp - 273.15).toFixed(0);
    day.lowestAndHighestTemp = `${lowestTempCelsius} / ${highestTempCelsius} °C`;
    delete day.temperatures; 
  }
  display5dayWeatherData(dayData)
  return dayData;
}


async function runWithDefaultCoordinates() {
  const defaultLatitude = 49.246292
  const defaultLongitude = -123.116226
  const forecast = await fetchForecast({ lat:defaultLatitude, lon:defaultLongitude });
  createForecastData(forecast);
}


async function display5dayWeatherData(dayData) {
  const parentDiv = document.getElementById('forecast-daily-cards');

  for (let i = 1; i < dayData.length; i++) {
    const dayInfo = dayData[i];
    
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('daily-card');
    
    const dateHeader = document.createElement('p');
    dateHeader.classList.add('daily-date');
    dateHeader.textContent = dayInfo.date;

    
    const dayHeader = document.createElement('p');
    dayHeader.classList.add('daily-day');
    dayHeader.textContent = dayInfo.day;
    
    const tempRangeParagraph = document.createElement('p');
    tempRangeParagraph.classList.add('daily-avgTemp');
    tempRangeParagraph.textContent = dayInfo.lowestAndHighestTemp;

    const weatherIcon = document.createElement('img');
    weatherIcon.classList.add('daily-weatherIcon');
    const iconurl = "http://openweathermap.org/img/w/" + dayInfo.weatherIcon + ".png";
    weatherIcon.src = iconurl;

    const weatherStatue = document.createElement('p');
    weatherStatue.classList.add('daily-weather');

    // Check if there's rain during the day, otherwise show the weather condition between 12:00 - 15:00
    if (dayInfo.weatherIcon === 'Rain') {
      weatherStatue.textContent = 'Rain';

    } else {
      weatherStatue.textContent = dayInfo.weatherStatue;
    }
    dayDiv.appendChild(dateHeader);
    dayDiv.appendChild(dayHeader);
    dayDiv.appendChild(tempRangeParagraph); 
    dayDiv.appendChild(weatherIcon); 

    dayDiv.appendChild(weatherStatue); 

    
    parentDiv.appendChild(dayDiv);
  }
}

runWithDefaultCoordinates();

// function createForecastData(forecast) {
//   // Arrange the forecast data in the format below.
//   // while arranging data, we need to add logic to get average data of temperature.
//   const forecastData = [
//     // day 1
//     {
//       day: {
//         avg_tmp: 35,
//       },
//       hour: [
//         // 0-3
//         {},
//         // 3-6
//         {},
//       ],
//     },
//     // day 2
//     {
//       day: {
//         avg_tmp: 35,
//       },
//       hour: [
//         // 0-3
//         {},
//         // 3-6
//         {},
//       ],
//     },
//   ]
//   return forecastData
// }

// // here
// function display5DayForecastData(forecastData) {}

// //here
// // This function should be invoked from day forecast card in html.
// function dayForecastHandler() {
//   display3HourForecastData(day, forecastData)
// }
