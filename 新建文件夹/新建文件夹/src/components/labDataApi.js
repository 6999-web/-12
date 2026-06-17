export const fetchLabApi = async (endpoint, fallback) => {
  try {
    const response = await fetch(`/api/lab/${endpoint}`);
    if (!response.ok) throw new Error(`Lab API ${endpoint} returned ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`[lab-data-api] using static fallback for ${endpoint}`, error);
    return fallback;
  }
};
