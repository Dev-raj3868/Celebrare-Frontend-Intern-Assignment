import { useEffect, useState } from 'react';

const PHOTOS_API_URL = 'https://picsum.photos/v2/list?limit=30';

/** Fetches the initial set of 30 photos and exposes loading/error state. */
export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    async function fetchPhotos() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(PHOTOS_API_URL);

        if (!response.ok) {
          throw new Error(`The photo request failed (${response.status}).`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('The photo service returned an unexpected response.');
        }

        if (isActive) {
          setPhotos(data);
        }
      } catch (fetchError) {
        if (isActive) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : 'An unexpected error occurred while loading photos.',
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    fetchPhotos();

    return () => {
      isActive = false;
    };
  }, []);

  return { photos, loading, error };
}
