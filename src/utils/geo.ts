// Haversine formula calculation for Geolocation discovery

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // 1 decimal place
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function formatDistance(distanceKm?: number): string {
  if (distanceKm === undefined || isNaN(distanceKm)) return '-- km';
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

export interface CityPreset {
  name: string;
  lat: number;
  lng: number;
}

export const CITY_PRESETS: CityPreset[] = [
  { name: 'Tehran (North - Jordan)', lat: 35.782, lng: 51.423 },
  { name: 'Tehran (Central - Valiasr)', lat: 35.7615, lng: 51.411 },
  { name: 'Tehran (West - Shahrak Gharb)', lat: 35.753, lng: 51.365 },
  { name: 'Isfahan (Chaharbagh)', lat: 32.6546, lng: 51.668 },
  { name: 'Shiraz (Eram)', lat: 29.6293, lng: 52.518 },
  { name: 'Tabriz (El Goli)', lat: 38.0267, lng: 46.368 },
];
