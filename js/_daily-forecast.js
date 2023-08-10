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
  console.log(data);
  const forecastData = [];
  let firstDay = true;

  for (const item of data.list) {
    const dateTime = new Date(item.dt_txt);
    const date = dateTime.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    const dayName = dateTime.toLocaleDateString(undefined, {
      weekday: "short",
    });
    const hour = dateTime.getHours().toString();
    const temperature = convertKelvinToCelsius(item.main.temp);
    const weatherStatue = item.weather[0].main;
    const weatherIcon = item.weather[0].icon;

    if (!firstDay) {
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
          date: date,
          day: dayName,
          threeHourRangeData: [
            { hour, temperature, weatherStatue, weatherIcon },
          ],
        });
      }
    } else {
      firstDay = false;
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
  console.log("create forecast", forecastData);
  return forecastData;
}

function display5dayWeatherData(forecastData) {
  console.log("5days");
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
    const iconurl =
      "http://openweathermap.org/img/w/" + dayInfo.weatherIcon + ".png";
    weatherIcon.src = iconurl;

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
    dayDiv.appendChild(tempRangeParagraph);
    dayDiv.appendChild(weatherIcon);

    dayDiv.appendChild(weatherStatue);

    parentDiv.appendChild(dayDiv);
  }
}

// receive forecastData and  a dayIndex (0 - 4), display it in 3-hour range section
function display3HourRangeForecastData(forecastData, dayIndex) {
  console.log("3 hours range");
  const threeHourRangeData = forecastData[dayIndex].threeHourRangeData;
  const parentDiv = document.getElementById("forecast-3-hours-range-cards");
  // clear the data every time
  parentDiv.innerHTML = "";
  for (let data of threeHourRangeData) {
    const { hour, temperature, weatherIcon } = data;
    // declare the card component
    const cardEle = document.createElement("div");
    cardEle.classList.add("forecast-3-hour-range-card");

    // declare the hour part
    const hourParagraph = document.createElement("p");
    hourParagraph.classList.add("hour-paragraph");
    hourParagraph.textContent = hour;
    // declare the weather icon part
    const weatherIconEle = document.createElement("img");
    const iconUrl = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
    weatherIconEle.src = iconUrl;
    // declare the temperature part
    const tempParagraph = document.createElement("p");
    tempParagraph.classList.add("temp-paragraph");
    tempParagraph.textContent = temperature + "°";

    cardEle.appendChild(hourParagraph);
    cardEle.appendChild(weatherIconEle);
    cardEle.appendChild(tempParagraph);
    parentDiv.appendChild(cardEle);
  }
}
