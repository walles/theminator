import { Color } from "./color";

export function generateColors(background: Color, keys: string[]) {
  // FIXME: For each category in keys, randomly pick a hue. Then randomize the
  // luminance of the colors.

  let newColorCustomizations: Record<string, string> = {};
  for (const key of keys) {
    newColorCustomizations[key] = generateColorForKey(
      key,
      background
    ).toString();
  }
}

function generateColorForKey(key: string, background: Color): Color {
  if (key.toLowerCase().includes("background")) {
    return Color.contrastRatio(background, null, 3);
  }

  if (key.toLowerCase().includes("foreground")) {
    return Color.contrastRatio(background, 7, null);
  }

  // Neither background nor foreground
  return Color.contrastRatio(background, 3, 4);
}
