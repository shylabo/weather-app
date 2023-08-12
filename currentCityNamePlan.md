There are four location sources.

Location(lat, lon) from

1. Browser (based on actual user location) \*permission allowed
   -> city name comes from open weather api
   set currentCityName(LocalStorage) = weatherApiFetchedData.cityName => vancouver

2. By default(Vancouver) cuz Browser \*permission denied
   -> city name comes from open weather api
   set currentCityName(LocalStorage) = weatherApiFetchedData.cityName => north vancouver

3. Google Geo API via Search
   -> city name comes from Google Geo API
   set currentCityName(LocalStorage) = googleGeoApi.cityName => "Tokyo"

4. DropDown(Favorites) (OpenWeather)
   -> city name comes from open weather api (not fetching but use from localStorage)
   set currentCityName(LocalStorage) = LocalStorage.CurrentCityName => "xxxxx"
   use city name in favorites

We want to use city name from only one resource.
a. geo api => x
b. weather api => OK => name sucks

I gave up using city name from only one resource.

Our strategy is to store "current city name" in Local Storage

City name in Favorites dropdown
