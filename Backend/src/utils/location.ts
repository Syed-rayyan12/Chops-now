/**
 * Location utility functions for distance calculations and location-based features
 */

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Validate latitude and longitude values
 */
export function validateCoordinates(lat: number, lon: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180 &&
    !isNaN(lat) &&
    !isNaN(lon)
  );
}

/**
 * Check if a point is within a radius from another point
 * @param centerLat Center point latitude
 * @param centerLon Center point longitude
 * @param pointLat Point to check latitude
 * @param pointLon Point to check longitude
 * @param radiusKm Radius in kilometers
 * @returns true if point is within radius
 */
export function isWithinRadius(
  centerLat: number,
  centerLon: number,
  pointLat: number,
  pointLon: number,
  radiusKm: number
): boolean {
  const distance = calculateDistance(centerLat, centerLon, pointLat, pointLon);
  return distance <= radiusKm;
}

/**
 * Find entities within a specified radius
 * Filters an array of entities that have latitude and longitude
 */
export function filterByRadius<T extends { latitude?: number | null; longitude?: number | null }>(
  centerLat: number,
  centerLon: number,
  entities: T[],
  radiusKm: number
): T[] {
  return entities.filter(entity => {
    if (!entity.latitude || !entity.longitude) return false;
    return isWithinRadius(centerLat, centerLon, entity.latitude, entity.longitude, radiusKm);
  });
}

/**
 * Calculate estimated delivery time based on distance
 * @param distanceKm Distance in kilometers
 * @returns Estimated time in minutes
 */
export function estimateDeliveryTime(distanceKm: number): number {
  // Assumptions:
  // - Average speed: 25 km/h (considering traffic, stops, etc.)
  // - Base time: 5 minutes (preparation time)
  const averageSpeedKmPerHour = 25;
  const baseTimeMinutes = 5;
  
  const travelTimeMinutes = (distanceKm / averageSpeedKmPerHour) * 60;
  return Math.ceil(baseTimeMinutes + travelTimeMinutes);
}
