import { cssRaw } from "typestyle";

const rawtheme = {
  foregroundBgColor: "#3b3b3b",
  foregroundHBgColor: "#4e4e4e",
  middlegroundBgColor: "#343434",
  middlegroundHBgColor: "#000",
  backgroundBgColor: "#222222",
  backgroundHBgColor: "#000",
  textColor: "#bdbdbd",
  textHColor: "#fff",
  accentColor: "#a75900",
  accentHColor: "#ffb42e"
};

function camelCaseToDash(str: string) {
  return str.replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase();
}

function adjustCasing(str: string): string {
  return camelCaseToDash(str);
}

function transformTheme(): typeof rawtheme {
  return Object.fromEntries(
    Object.entries(rawtheme).map(([key, value]) => [
      key,
      "var(--" + adjustCasing(key) + ")"
    ])
  ) as typeof rawtheme;
}

export const Theme = transformTheme();
export function enableTheme() {
  const cssVars =
    ":root{" +
    Object.entries(rawtheme)
      .map(([key, value]) => `--${adjustCasing(key)}: ${value};`)
      .join("") +
    "}";

  cssRaw(cssVars);

  // for (const [key, value] of Object.entries(rawtheme)) {
  //   document.body.style.setProperty("--" + adjustCasing(key), value);
  // }
}
