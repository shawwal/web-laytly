export const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use the hash to create an RGB color
  const r = (hash >> 16) & 0xff;
  const g = (hash >> 8) & 0xff;
  const b = hash & 0xff;

  // Calculate luminance (perceived brightness) of the color
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // If the luminance is too low (dark color), lighten it
  if (luminance < 128) {
    // Lighten the color by adjusting the RGB values towards white
    return `rgb(${Math.min(r + 100, 255)}, ${Math.min(g + 100, 255)}, ${Math.min(b + 100, 255)})`;
  } else {
    // Otherwise, return the color as is (it is already bright enough)
    return `rgb(${r}, ${g}, ${b})`;
  }
};
