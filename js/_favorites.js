// ============================ //
//  Action handling
// ============================ //
async function favoritesHandler() {
  const formattedName = getFormattedName();

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const favoriteNames = favorites.map((favorite) => favorite.name);

  if (favoriteNames.includes(formattedName)) {
    await removeFromFavorites(formattedName, favorites);
  } else {
    const currentLocation = JSON.parse(localStorage.getItem("currentLocation"));
    const lat = currentLocation.coord.lat;
    const lon = currentLocation.coord.lon;
    await addToFavorites({ formattedName, lat, lon, favorites });
  }
  await updateFavoriteStatus();
  await loadFavorites();
}

function addToFavorites({ formattedName, lat, lon, favorites }) {
  const favorite = {
    name: formattedName,
    latitude: lat,
    longitude: lon,
  };
  favorites.push(favorite);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function removeFromFavorites(formattedName, favorites) {
  const favoriteNames = favorites.map((favorite) => favorite.name);
  if (favoriteNames) {
    const newFavorites = favorites.filter(
      (favorite) => favorite.name !== formattedName
    );
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  }
}

// ============================ //
//  DOM Manipulation
// ============================ //

function loadFavorites() {
  // Get favorites list from local storage.
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Initiate dropdown elements
  const favoritesDropdown = document.getElementById("favorites-dropdown");
  favoritesDropdown.innerHTML =
    '<option value="" disabled selected>Favorite Cities</option>';

  // Add option element in favorites dropdown.
  favorites.forEach((favorite) => {
    const option = document.createElement("option");
    option.value = favorite.name;
    option.textContent = favorite.name;
    favoritesDropdown.appendChild(option);
  });
}

function updateFavoriteStatus() {
  const favoriteButton = document.getElementById("favorite-button");
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const favoriteNames = favorites.map((favorite) => favorite.name);

  const currentCityName = getFormattedName();

  if (favoriteNames.includes(currentCityName)) {
    favoriteButton.innerHTML = '<i class="material-icons orange600">star</i>';
  } else {
    favoriteButton.innerHTML = '<i class="material-icons">star_border</i>';
  }
}

function getFormattedName() {
  const currentLocation = JSON.parse(localStorage.getItem("currentLocation"));
  const cityName = currentLocation.name;
  const country = currentLocation.sys.country;
  const formattedName = `${cityName}, ${country}`;
  return formattedName;
}

loadFavorites();
