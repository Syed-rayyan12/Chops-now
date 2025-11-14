/**
 * Location utilities for GPS functionality
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Get current GPS position from browser
 */
export function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(error.code === 1 ? "Location permission denied" : "Unable to get location"));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

/**
 * Get address from coordinates using reverse geocoding
 */
export async function getAddressFromCoords(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      { headers: { "User-Agent": "ChopNow/1.0" } }
    );
    const data = await res.json();
    const addr = data.address;
    return [addr.road, addr.suburb, addr.city, addr.postcode]
      .filter(Boolean)
      .join(", ") || data.display_name;
  } catch {
    return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
  }
}
