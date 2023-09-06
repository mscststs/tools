import daisy from "daisyui/src/theming/themes";

const themes = [
  {
    lite: {
      primary: "#3955cb",
      "primary-content": "#fff",
      secondary: "#5abf99",
      accent: "#e59d59",
      neutral: "#271a2e",
      "base-100": "#fcfcfc",
      info: "#232b35",
      success: "#55ac68",
      "success-content": "#fff",
      warning: "#e5ac49",
      "warning-content": "#fff",
      error: "#f34939",
      "error-content": "#fff",
      "--rounded-box": "0.25rem",
      "--rounded-btn": ".25rem",
      "--rounded-badge": ".125rem",
      "--border-btn": "1px",
      "--tab-border": "1px",
      "--tab-radius": "0.5rem",
    },
    business: {
      ...daisy["[data-theme=business]"],
      "--rounded-box": "0.125rem",
    },
  },
  // "business",
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
