export const KEYS = {
  SESSION: 'almas_session',
  BOOKINGS: 'almas_bookings',
  AVAILABILITY: 'almas_availability'
};

export const getFromStorage = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading key ${key} from localStorage`, error);
    return fallback;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing key ${key} to localStorage`, error);
  }
};

export const seedInitialData = () => {
  if (!localStorage.getItem(KEYS.BOOKINGS)) {
    setToStorage(KEYS.BOOKINGS, []);
  }

  if (!localStorage.getItem(KEYS.AVAILABILITY)) {
    setToStorage(KEYS.AVAILABILITY, {});
  }
};

export const generateBookingId = () => {
  const bookings = getFromStorage(KEYS.BOOKINGS, []);
  const lastIdNum = bookings.reduce((max, b) => {
    if (!b.id || !b.id.startsWith("ALM")) return max;
    const num = parseInt(b.id.replace('ALM', ''), 10);
    return num > max ? num : max;
  }, 1000);
  return `ALM${lastIdNum + 1}`;
};

export const generateVehicleId = (vehicles = []) => {
  const lastIdNum = vehicles.reduce((max, v) => {
    if (!v.id || !v.id.startsWith("v")) return max;
    const num = parseInt(v.id.replace('v', ''), 10);
    return num > max ? num : max;
  }, 0);
  const nextNum = lastIdNum + 1;
  return `v${nextNum < 10 ? '0' + nextNum : nextNum}`;
};
