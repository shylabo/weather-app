// ============================ //
//  Action handling
// ============================ //
async function favoritesHandler() {
  const currentCityName = localStorage.getItem("currentCityName");

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const favoriteNames = favorites.map((favorite) => favorite.name);

  if (favoriteNames.includes(currentCityName)) {
    await removeFromFavorites(currentCityName, favorites);
  } else {
    const currentLocation = JSON.parse(localStorage.getItem("currentLocation"));
    const lat = currentLocation.coord.lat;
    const lon = currentLocation.coord.lon;
    await addToFavorites({ currentCityName, lat, lon, favorites });
  }
  // set LocalStorage
  await updateCurrentCityName(currentCityName);

  await updateFavoriteStatus();
  await loadFavorites();
}

function addToFavorites({ currentCityName, lat, lon, favorites }) {
  const favorite = {
    name: currentCityName,
    latitude: lat,
    longitude: lon,
  };
  favorites.push(favorite);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function removeFromFavorites(currentCityName, favorites) {
  const favoriteNames = favorites.map((favorite) => favorite.name);
  if (favoriteNames) {
    const newFavorites = favorites.filter(
      (favorite) => favorite.name !== currentCityName
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

  const currentCityName = localStorage.getItem("currentCityName");

  if (favoriteNames.includes(currentCityName)) {
    favoriteButton.innerHTML = '<i class="material-icons orange600">star</i>';
  } else {
    favoriteButton.innerHTML = '<i class="material-icons">star_border</i>';
  }
}

loadFavorites();
