# weather-app

## set-up

1. Create env file
   **_:Note that this is an abnormal way to avoid using Node.js (If it's available, .env must be used)_**

```sh
$ make init # Generates env.js file in js folder
```

2. Add your API key for each variable.

- OpenWeatherAPI
  - https://openweathermap.org/api
- GoogleGeoAPI
  - https://console.cloud.google.com/google/maps-apis

## docs

https://docs.google.com/document/d/1cDtnnSyPhBbte4dnJ6ypd4_YPHr9SBz2E5w2AlMgu4Q/edit

## Wire frame

https://whimsical.com/5KrvqouiFGBcgW7RtQQMLV

## Requirements

- [x] 1. Follow wireframe to create the structure of your page for desktop and mobile. It is up to you how to design, include images and icons in the project.
- [x] 2. Search input should use Google Places Autocomplete for suggesting cities only.
- [x] 3. The default city should be based on users’ location. In case the user blocks the location info, Vancouver should be the default.
- [x] 4. When the user clicks on the star icon, the city should be included on the dropdown for “Favorite cities”.
- [x] 5. Favorite cities should be stored in localStorage. After the page loads, check if there is something saved there. If yes, append city options in the dropdown.
- [x] 6. When the user clicks on one of the options for dropdown, the weather info for the selected city should be loaded on the page.
- [x] 7. Create Fetch API calls to get the current weather and forecast for the next 5 days.
- [ ] 8. When the user clicks on one of the cards in the “Daily forecast” section, the “3 hour range” section should change the data based on the day clicked.
- [x] 9. SCSS files should be used for styling files.
- [x] 10. Media queries should be used for responsive behaviors in the page.
- [x] 11. Desktop size: 1440px / Mobile: 375px
- [ ] 12. Slides for your presentation are required.

## icons

https://materializecss.com/icons.html

## Naming convention

- FLOCSS (CSS architecture methodology)
  - https://github.com/hiloki/flocss/blob/master/README_eng.md
- BEM (Naming convention)
  - https://codeburst.io/understanding-css-bem-naming-convention-a8cca116d252
  - https://bem-cheat-sheet.9elements.com/

# External APIs

- OpenWeather API
  - https://openweathermap.org/
- Google Places API
  - https://developers.google.com/maps/documentation/places/web-service
