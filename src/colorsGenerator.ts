import { Color } from "./color";

export function generateColors(
  background: Color,
  keys: string[]
): Record<string, string> {
  // For each category in keys, randomly pick a hue. Then randomize the
  // luminance of the colors.

  // Create a mapping from categories (like "debugConsole") to color names (like
  // "errorForeground")
  const colorNames = new Map<string, string[]>();
  for (const key of keys) {
    const split = key.split(".", 2);
    if (split.length === 1) {
      // Set an empty category
      split.unshift("");
      continue;
    }
    const category = split[0];
    const colorName = split[1];

    let colorNamesArray = colorNames.get(category);
    if (colorNamesArray === undefined) {
      colorNamesArray = [];
    }
    colorNamesArray.push(colorName);
    colorNames.set(category, colorNamesArray);
  }

  // Randomize colors by category
  const newColorCustomizations: Record<string, string> = {};
  for (const entry of colorNames.entries()) {
    const category = entry[0];
    const names = entry[1];

    // Hue for this category
    const hue = Math.random() * 255;

    for (const name of names) {
      const saturation = Math.random();

      const lightness = getContrastLightness(background.lightness(), name);
      if (lightness === undefined) {
        // This problem is logged inside of getContrastLightness(), just skip
        // here without logging
        continue;
      }

      let customizeName = name;
      if (category.length > 0) {
        customizeName = category + "." + customizeName;
      }
      newColorCustomizations[customizeName] = Color.hsl(
        hue,
        saturation,
        lightness
      ).toString();
    }
  }

  return newColorCustomizations;
}

/**
 * @param baseLightness This is what you want to contrast against
 * @param name Inspiration for what kind of contrast you'll get
 */
function getContrastLightness(
  baseLightness: number,
  name: string
): number | undefined {
  let contrast: number;
  if (name.toLowerCase().includes("background")) {
    contrast = 1.3;
  } else if (name.toLowerCase().includes("foreground")) {
    contrast = 8;
  } else {
    contrast = 2;
  }

  // Contrast is computed as (brightest + 0.05) / (darkest + 0.05). So if we
  // want a particular contrast, that can be achieved by inserting baseLightness
  // as brightest and solve for darkest or the other way around.
  const brighterLightness = contrast * baseLightness + 0.05 * contrast - 0.05;
  const darkerLightness = (baseLightness - 0.05 * contrast + 0.05) / contrast;
  const lightnessCandidates = [];
  if (brighterLightness <= 1) {
    lightnessCandidates.push(brighterLightness);
  }
  if (darkerLightness >= 0) {
    lightnessCandidates.push(darkerLightness);
  }
  if (lightnessCandidates.length === 0) {
    console.warn(
      `Cannot reach contrast ${contrast} for lightness ${baseLightness} and color name ${name}`
    );
    return undefined;
  }

  // Pick either candidate
  return lightnessCandidates[
    Math.floor(Math.random() * lightnessCandidates.length)
  ];
}
