/**
 * NoidaGym Marketplace - Location & Geolocation Service
 * Computes Haversine distances to gyms and handles browser location permission politely.
 */

window.NoidaLocation = (function () {
  let userCoords = null;
  let isLocating = false;

  // Haversine formula
  function getDistanceInKm(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  function getUserCoordinates() {
    return userCoords;
  }

  function clearUserLocation() {
    userCoords = null;
    sessionStorage.removeItem('noidagym_user_coords');
    document.querySelectorAll('.location-btn').forEach(btn => {
      btn.classList.remove('active');
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20M12 2a10 10 0 1 0 10 10"/></svg> Use My Location`;
    });
  }

  function requestUserLocation(onSuccess, onError) {
    if (!navigator.geolocation) {
      if (onError) onError('Geolocation is not supported by your browser.');
      return;
    }

    isLocating = true;
    document.querySelectorAll('.location-btn').forEach(btn => {
      btn.innerHTML = `<span>Locating...</span>`;
    });

    navigator.geolocation.getCurrentPosition(
      position => {
        isLocating = false;
        userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        sessionStorage.setItem('noidagym_user_coords', JSON.stringify(userCoords));

        document.querySelectorAll('.location-btn').forEach(btn => {
          btn.classList.add('active');
          btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg> Location Active`;
        });

        if (onSuccess) onSuccess(userCoords);
      },
      error => {
        isLocating = false;
        document.querySelectorAll('.location-btn').forEach(btn => {
          btn.classList.remove('active');
          btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Retry Location`;
        });

        let msg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can still search by Noida sector or landmark.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please try selecting a Noida sector.';
        }

        if (onError) onError(msg);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }

  // Check if previously acquired in session
  const stored = sessionStorage.getItem('noidagym_user_coords');
  if (stored) {
    try {
      userCoords = JSON.parse(stored);
    } catch (e) {}
  }

  return {
    getDistanceInKm,
    getUserCoordinates,
    requestUserLocation,
    clearUserLocation
  };
})();
