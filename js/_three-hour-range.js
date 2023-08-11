function handleDailyCardSelectStatus(selectedDayIndex) {
  const currentSelectedCardElements = document.getElementsByClassName(
    "daily-card-selected"
  );
  // if one of the cards is selected, unselect the card
  console.log(currentSelectedCardElements);
  if (currentSelectedCardElements.length !== 0) {
    currentSelectedCardElements[0].classList.remove("daily-card-selected");
  }
  const dailyCardElements = document.getElementsByClassName("daily-card");
  dailyCardElements[selectedDayIndex].classList.add("daily-card-selected");
}

// receive forecastData and  a selectedDayIndex (0 - 4), display it in 3-hour range section
function display3HourRangeForecastData(forecastData, selectedDayIndex) {
  handleDailyCardSelectStatus(selectedDayIndex);
  const dataOnSelectedDate = forecastData[selectedDayIndex];
  const { date, day, threeHourRangeData } = dataOnSelectedDate;
  // change the title depending on the selected date
  const titleEle = document.getElementById("title-3-hour-range-forecast");
  titleEle.innerHTML = `${date}, ${day}`;

  const parentDiv = document.getElementById("forecast-3-hours-range-cards");
  // clear the data every time
  parentDiv.innerHTML = "";
  for (let data of threeHourRangeData) {
    const { hour, temperature, weatherIcon, weatherStatue } = data;
    // declare the card component
    const cardEle = document.createElement("div");
    cardEle.classList.add("forecast-3-hour-range-card");

    // declare the hour part
    const hourParagraph = document.createElement("p");
    hourParagraph.classList.add("hour-paragraph");
    hourParagraph.textContent = hour;
    // declare the weather icon part
    const weatherIconEle = document.createElement("img");
    const iconUrl = "/public/images/icons/" + weatherIcon + "@2x.png";
    weatherIconEle.src = iconUrl;
    weatherIconEle.classList.add("weather-icon");
    const weatherIconContainer = document.createElement("div");
    weatherIconContainer.classList.add("weather-icon-container");
    weatherIconContainer.appendChild(weatherIconEle);
    const tempAndWeatherStatusContainer = document.createElement("div");
    tempAndWeatherStatusContainer.classList.add(
      "tempAndWeatherStatus-Container"
    );
    // declare the temperature part
    const tempParagraph = document.createElement("p");
    tempParagraph.classList.add("temp-paragraph");
    tempParagraph.textContent = temperature + "°C";
    tempAndWeatherStatusContainer.appendChild(tempParagraph);
    // declare the temperature part
    const weatherStatusParagraph = document.createElement("p");
    weatherStatusParagraph.classList.add("weather-status-paragraph");
    weatherStatusParagraph.textContent = weatherStatue;
    tempAndWeatherStatusContainer.appendChild(weatherStatusParagraph);

    cardEle.appendChild(hourParagraph);
    cardEle.appendChild(weatherIconContainer);
    cardEle.appendChild(tempAndWeatherStatusContainer);
    parentDiv.appendChild(cardEle);
  }
}

// change the display of  3 hour range forecast on clicking the daily forecast card
function addEventListenerToDailyCard(forecastData) {
  const dailyCardElements = document.getElementsByClassName("daily-card");
  for (let i = 0; i < dailyCardElements.length; i++) {
    dailyCardElements[i].addEventListener("click", () => {
      display3HourRangeForecastData(forecastData, i);
    });
  }
}

function initThreeHourRangeArea(forecastData) {
  display3HourRangeForecastData(forecastData, 0);
  addEventListenerToDailyCard(forecastData);
}
