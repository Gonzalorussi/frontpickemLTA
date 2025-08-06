// utils/cache.js

// Lunes a las 20:00:00 hora ARG (GMT-3)
function getNextResetDate() {
  const now = new Date();

  // Día de la semana (0 = domingo, 1 = lunes, ..., 6 = sábado)
  const day = now.getDay();
  const diffToMonday = (1 + 7 - day) % 7;

  // Fecha base: próximo lunes
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + diffToMonday);
  nextMonday.setHours(21, 0, 0, 0); // 21:00:00

  // Si hoy ya es lunes y son las 20:00 o más, entonces espera hasta el siguiente lunes
  if (day === 1 && now >= nextMonday) {
    nextMonday.setDate(nextMonday.getDate() + 7);
  }

  return nextMonday.getTime();
}

function isCacheValid(timestamp) {
  const resetTime = getNextResetDate();
  return timestamp < resetTime;
}

export function setCache(key, data) {
  const payload = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(payload));
}

export function getCache(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const { data, timestamp } = JSON.parse(raw);
    if (isCacheValid(timestamp)) {
      return data;
    } else {
      localStorage.removeItem(key);
      return null;
    }
  } catch (e) {
    console.warn("⚠️ Error parsing cache:", e);
    localStorage.removeItem(key);
    return null;
  }
}

export function clearCache(key) {
  localStorage.removeItem(key);
}

