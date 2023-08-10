// receive forecastData and  a dayIndex (0 - 4), display it in 3-hour range section
function display3HourRangeForecastData(forecastData, dayIndex) {
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
    tempParagraph.textContent = temperature + "℃";

    cardEle.appendChild(hourParagraph);
    cardEle.appendChild(weatherIconEle);
    cardEle.appendChild(tempParagraph);
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
