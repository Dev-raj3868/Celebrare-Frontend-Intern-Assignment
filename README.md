# Photo Gallery - Celebrare Frontend Intern Assignment

A React + Vite photo gallery that follows the supplied three-page assignment brief. It fetches 30 photos from the Picsum Photos API, filters the already-fetched photos by author name, and stores favourite photo IDs in localStorage using `useReducer`.

## Run locally

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

Create a production build with:

```bash
npm run build
npm run preview
```

## Assignment requirements implemented

1. **Project setup:** React + Vite, with Tailwind CSS as the only styling system. No component library is used.
2. **API:** `useFetchPhotos` requests `https://picsum.photos/v2/list?limit=30` on mount and exposes `photos`, `loading`, and `error`.
3. **Responsive grid:** one column on mobile, two on tablet, and four on desktop. Cards show the photo, author, and heart button.
4. **Search:** filters by author name as the user types. It does not reload the page or make another API request.
5. **Favourites:** the `favoritesReducer` handles `TOGGLE_FAVORITE`; `useReducer` owns the list and localStorage persists it across refreshes.
6. **Custom hook:** the Gallery component calls `useFetchPhotos`; it does not fetch data directly.
7. **Performance hooks:** `useCallback` is used for the search input handler and `useMemo` computes the filtered photo list.

## Code map

- `src/hooks/useFetchPhotos.js` - API request and loading/error state.
- `src/reducers/favoritesReducer.js` - favourite toggle reducer and localStorage initializer.
- `src/components/Gallery.jsx` - gallery UI, search, favourites persistence, and photo cards.
- `src/App.jsx` - app entry component.
- `src/index.css` and `tailwind.config.js` - Tailwind setup and global styles.


