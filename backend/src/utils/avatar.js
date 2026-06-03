export const avatarDataUri = (seed = 'GameHub') => {
  const label = String(seed).slice(0, 2).toUpperCase();
  const hue = [...String(seed)].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="hsl(${hue},75%,45%)"/><circle cx="33" cy="38" r="6" fill="#fff"/><circle cx="63" cy="38" r="6" fill="#fff"/><path d="M30 61c11 9 25 9 36 0" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none"/><text x="48" y="86" text-anchor="middle" font-size="18" font-family="Arial" font-weight="700" fill="#fff">${label}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};
