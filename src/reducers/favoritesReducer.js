export const FAVORITES_STORAGE_KEY = 'celebrare-photo-gallery-favorites';

/** Keeps the favourites list as an array of Picsum photo IDs. */
export function favoritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_FAVORITE': {
      const isAlreadyFavorite = state.includes(action.id);

      return isAlreadyFavorite
        ? state.filter((photoId) => photoId !== action.id)
        : [...state, action.id];
    }

    default:
      return state;
  }
}

/** Reads saved favourites once, when useReducer initializes. */
export function getInitialFavorites() {
  try {
    if (typeof window === 'undefined') {
      return [];
    }

    const savedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);

    if (!savedFavorites) {
      return [];
    }

    const parsedFavorites = JSON.parse(savedFavorites);

    return Array.isArray(parsedFavorites)
      ? parsedFavorites.filter((photoId) => typeof photoId === 'string')
      : [];
  } catch {
    // A blocked or malformed localStorage value should not prevent the gallery
    // from rendering. The gallery starts with an empty favourites list instead.
    return [];
  }
}
