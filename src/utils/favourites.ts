const FAVOURITES_KEY = 'mrtleh_favourites';
const MAX_FAVOURITES = 5;

export interface Favourite {
  stationCode: string;
  lineCode: string;
}

export const getFavourites = (): Favourite[] => {
  try {
    const stored = localStorage.getItem(FAVOURITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const addFavourite = (stationCode: string, lineCode: string): boolean => {
  const favourites = getFavourites();

  if (favourites.length >= MAX_FAVOURITES) {
    return false;
  }

  if (favourites.some(f => f.stationCode === stationCode)) {
    return false;
  }

  favourites.push({ stationCode, lineCode });
  localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites));
  return true;
};

export const removeFavourite = (stationCode: string): void => {
  const favourites = getFavourites();
  const filtered = favourites.filter(f => f.stationCode !== stationCode);
  localStorage.setItem(FAVOURITES_KEY, JSON.stringify(filtered));
};

export const isFavourite = (stationCode: string): boolean => {
  const favourites = getFavourites();
  return favourites.some(f => f.stationCode === stationCode);
};
