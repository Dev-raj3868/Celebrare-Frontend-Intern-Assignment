import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import useFetchPhotos from '../hooks/useFetchPhotos.js';
import {
  FAVORITES_STORAGE_KEY,
  favoritesReducer,
  getInitialFavorites,
} from '../reducers/favoritesReducer.js';

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 8.7c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z" />
    </svg>
  );
}

function LoadingState() {
  return (
    <div
      className="flex min-h-64 flex-col items-center justify-center gap-4 text-gallery-700"
      role="status"
      aria-live="polite"
    >
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-gallery-200 border-t-gallery-600" />
      <span className="text-sm font-medium">Loading photos...</span>
    </div>
  );
}

function PhotoCard({ photo, isFavorite, onToggleFavorite }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={photo.download_url}
          alt={`Photo by ${photo.author}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <button
          type="button"
          onClick={() => onToggleFavorite(photo.id)}
          aria-label={isFavorite ? `Remove ${photo.author} from favourites` : `Add ${photo.author} to favourites`}
          aria-pressed={isFavorite}
          className={`absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gallery-500 focus:ring-offset-2 ${
            isFavorite ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
          }`}
        >
          <HeartIcon filled={isFavorite} />
        </button>
      </div>
      <div className="px-4 py-3.5">
        <p className="truncate text-sm font-semibold text-slate-800">{photo.author}</p>
      </div>
    </article>
  );
}

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, dispatch] = useReducer(
    favoritesReducer,
    undefined,
    getInitialFavorites,
  );

  // Keep the favourites list available after the next page load.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favorites),
      );
    } catch {
      // The gallery remains usable when browser storage is unavailable.
    }
  }, [favorites]);

  // useCallback keeps a stable search-handler reference between renders.
  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  // Search is performed locally against the 30 photos already in memory.
  const filteredPhotos = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return photos;
    }

    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(normalizedQuery),
    );
  }, [photos, searchQuery]);

  function handleToggleFavorite(photoId) {
    dispatch({ type: 'TOGGLE_FAVORITE', id: photoId });
  }

  return (
    <main className="min-h-screen bg-[#fbf9fd] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1440px]">
        <header className="mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gallery-600">
              Picsum Photos
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Photo Gallery
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Browse the collection and save your favourite photos.
            </p>
          </div>

          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search photos by author name</span>
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by author name..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-gallery-500 focus:ring-4 focus:ring-gallery-100"
            />
          </label>
        </header>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <div
            className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-8 text-center"
            role="alert"
          >
            <p className="font-semibold text-rose-800">Unable to load photos</p>
            <p className="mt-2 text-sm text-rose-700">{error}</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <p className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500">
            No photos found for “{searchQuery}”.
          </p>
        ) : (
          <section
            aria-label="Photo gallery"
            className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
          >
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFavorite={favorites.includes(photo.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
