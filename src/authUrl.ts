export const getAppUrl = (path = "/") => {
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};
