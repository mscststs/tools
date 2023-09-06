const themes = [
  {
    lite: {
      primary: "#3955cb",
      secondary: "#5abf99",
      accent: "#e59d59",
      neutral: "#271a2e",
      "base-100": "#fcfcfc",
      info: "#232b35",
      success: "#55ac68",
      warning: "#e5ac49",
      error: "#f34939",
      "--rounded-box": "0.25rem",
      "--rounded-btn": ".25rem",
      "--rounded-badge": ".125rem",
      "--border-btn": "1px",
      "--tab-border": "1px",
      "--tab-radius": "0.5rem",
    },
  },
  "business",
  "light",
  "dark",
  "cupcake",
  // "bumblebee",
  // "emerald",
  // "corporate",
  // "synthwave",
  // "retro",
  // "cyberpunk",
  // "valentine",
  // "halloween",
  // "garden",
  // "forest",
  // "aqua",
  // "lofi",
  // "pastel",
  // "fantasy",
  // "wireframe",
  // "black",
  // "luxury",
  // "dracula",
  // "cmyk",
  // "autumn",
  // "acid",
  // "lemonade",
  // "night",
  // "coffee",
  // "winter",
];

export default themes;

/**
 * 所有主题的名字
 */
export const themeNames = themes.reduce((p: any, c) => {
  if (typeof c === "object") {
    return [...p, ...Object.keys(c)];
  } else {
    return [...p, c];
  }
}, []);
