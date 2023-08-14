// ============================ //
//  External API (OpenWeather API)
// ============================ //
async function fetchForecast({ lat, lon }) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}`;

  try {
    const res = await fetch(apiUrl);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    } else {
      const data = await res.json();

      return data;
    }
  } catch (err) {
    console.error(err);
  }
}

function createForecastData(data) {
  const forecastData = [];

  for (const item of data.list) {
    const dateTime = new Date(item.dt_txt);
    const date = dateTime.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    const day = dateTime.toLocaleDateString(undefined, {
      weekday: "short",
    });
    const hour = dateTime.getHours().toString();
    const temperature = convertKelvinToCelsius(item.main.temp);
    const weatherStatue = item.weather[0].main;
    const weatherIcon = item.weather[0].icon;

    const existingDay = forecastData.find((day) => day.date === date);
    if (existingDay) {
      existingDay.threeHourRangeData.push({
        hour,
        temperature,
        weatherStatue,
        weatherIcon,
      });
    } else {
      forecastData.push({
        date,
        day,
        weatherStatue,
        weatherIcon,
        threeHourRangeData: [{ hour, temperature, weatherStatue, weatherIcon }],
      });
    }
  }

  for (const day of forecastData) {
    const temperatures = day.threeHourRangeData.map((data) => data.temperature);
    const lowestTemp = Math.min(...temperatures);
    const highestTemp = Math.max(...temperatures);
    const lowestTempCelsius = lowestTemp;
    const highestTempCelsius = highestTemp;
    day.lowestAndHighestTemp = `${lowestTempCelsius} / ${highestTempCelsius} °C`;
  }
  return forecastData;
}

function display5dayWeatherData(forecastData) {
  const parentDiv = document.getElementById("forecast-daily-cards");
  parentDiv.innerHTML = ""; // initiate parent elements
  // forecastData can be length of 5 or 6, depending on whether it includes today's data
  const startIndex = forecastData.length === 5 ? 0 : 1;
  for (let i = startIndex; i < forecastData.length; i++) {
    const dayInfo = forecastData[i];

    const dayDiv = document.createElement("div");
    dayDiv.classList.add("daily-card");

    const dateHeader = document.createElement("p");
    dateHeader.classList.add("daily-date");
    dateHeader.textContent = dayInfo.date;

    const dayHeader = document.createElement("p");
    dayHeader.classList.add("daily-day");
    dayHeader.textContent = dayInfo.day;

    const tempRangeParagraph = document.createElement("p");
    tempRangeParagraph.classList.add("daily-avgTemp");
    tempRangeParagraph.textContent = dayInfo.lowestAndHighestTemp;

    const weatherIcon = document.createElement("img");
    weatherIcon.classList.add("daily-weatherIcon");
    const iconUrl = "/public/images/icons/" + dayInfo.weatherIcon + "@2x.png";
    weatherIcon.src = iconUrl;
    const weatherStatue = document.createElement("p");
    weatherStatue.classList.add("daily-weather");
    // Check if there's rain during the day, otherwise show the weather condition between 12:00 - 15:00
    if (dayInfo.weatherIcon === "Rain") {
      weatherStatue.textContent = "Rain";
    } else {
      weatherStatue.textContent = dayInfo.weatherStatue;
    }
    dayDiv.appendChild(dateHeader);
    dayDiv.appendChild(dayHeader);
    dayDiv.appendChild(weatherIcon);
    dayDiv.appendChild(tempRangeParagraph);

    dayDiv.appendChild(weatherStatue);

    parentDiv.appendChild(dayDiv);
  }
}
