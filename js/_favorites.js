// ============================ //
//  Action handling
// ============================ //
async function favoritesHandler() {
  const currentLocation = JSON.parse(localStorage.getItem('currentLocation'))
  const cityName = currentLocation.name
  let favorites = JSON.parse(localStorage.getItem('favorites')) || []
  if (favorites.includes(cityName)) {
    await removeFromFavorites(cityName, favorites)
  } else {
    await addToFavorites(cityName, favorites)
  }
  await updateFavoriteStatus()
  await loadFavorites()
}

function addToFavorites(cityName, favorites) {
  favorites.push(cityName)
  localStorage.setItem('favorites', JSON.stringify(favorites))
}

function removeFromFavorites(cityName, favorites) {
  if (favorites) {
    const newFavorites = favorites.filter((favorite) => favorite !== cityName)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
  }
}

// ============================ //
//  DOM Manipulation
// ============================ //

function loadFavorites() {
  // Get favorites list from local storage.
  const favorites = JSON.parse(localStorage.getItem('favorites')) || []

  // Initiate dropdown elements
  const favoritesDropdown = document.getElementById('favorites-dropdown')
  favoritesDropdown.innerHTML = '<option value="" disabled selected>Favorite Cities</option>'

  // Add option element in favorites dropdown.
  favorites.forEach((cityName) => {
    const option = document.createElement('option')
    option.value = cityName
    option.textContent = cityName
    favoritesDropdown.appendChild(option)
  })
}

function updateFavoriteStatus() {
  const favoriteButton = document.getElementById('favorite-button')
  let favorites = JSON.parse(localStorage.getItem('favorites')) || []

  const currentLocation = JSON.parse(localStorage.getItem('currentLocation'))
  const currentCityName = currentLocation.name

  if (favorites.includes(currentCityName)) {
    favoriteButton.innerHTML = '<i class="material-icons orange600">star</i>'
  } else {
    favoriteButton.innerHTML = '<i class="material-icons">star_border</i>'
  }
}

loadFavorites()
