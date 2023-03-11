import { Color } from "./color";

/**
 * Generate a complete theme.
 *
 * Log warnings for unsupported color customization keys.
 */
export function generateColors(
  background: Color,
  keys: string[]
): Record<string, string> {
  const newColorCustomizations: Record<string, string> = {};

  const foreground = foregroundColorFromBackground(background);
  newColorCustomizations["foreground"] = foreground.toString();

  for (const key of keys) {
    if (key.endsWith(".background")) {
      newColorCustomizations[key] = generateColor(background).toString();
      continue;
    }

    if (key.endsWith(".foreground")) {
      newColorCustomizations[key] = generateColor(foreground).toString();
      continue;
    }
  }

  newColorCustomizations["tab.activeBackground"] =
    newColorCustomizations["editor.background"];
  newColorCustomizations["tab.unfocusedActiveBackground"] =
    newColorCustomizations["editor.background"];

  warnAboutMissingCustomizations(newColorCustomizations, keys);

  return newColorCustomizations;
}

function warnAboutMissingCustomizations(
  customizations: Record<string, string>,
  allKeys: string[]
) {
  for (const key of allKeys) {
    if (customizations[key] !== undefined) {
      continue;
    }
    console.warn("Key not customized", key);
  }
}

function foregroundColorFromBackground(background: Color): Color {
  let hue: number;
  if (background.saturation() === 0) {
    // Greyscale background
    hue = Math.random() * 360;
  } else {
    // Tinted background
    hue = (background.hue() + 180) % 360;
  }

  const saturation = 0.1;

  let lightness = 0.9;
  if (background.lightness() > 0.5) {
    lightness = 0.1;
  }

  return Color.hsl(hue, saturation, lightness);
}

/**
 * Generate a color that is somewhat close to another color. The hue will be
 * retained, saturation and value will be pushed around a bit.
 *
 * @param base Source of inspiration
 */
function generateColor(base: Color): Color {
  const saturationRadius = 0.1;
  const lightnessRadius = 0.1;

  const hue = base.hue();

  let saturation =
    base.saturation() - saturationRadius + Math.random() * saturationRadius * 2;
  if (base.saturation() === 0) {
    saturation = 0;
  } else if (saturation < 0) {
    saturation = 0;
  } else if (saturation > 1) {
    saturation = 1;
  }

  let lightness =
    base.lightness() - lightnessRadius + Math.random() * lightnessRadius * 2;
  if (base.lightness() === 0) {
    lightness = 0;
  } else if (lightness < 0) {
    lightness = 0;
  } else if (lightness > 1) {
    lightness = 1;
  }

  return Color.hsl(hue, saturation, lightness);
}
