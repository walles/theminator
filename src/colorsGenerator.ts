import { Color } from "./color";

export function generateColors(
  background: Color,
  keys: string[]
): Record<string, string> {
  // For each category in keys, randomly pick a hue. Then randomize the
  // luminance of the colors.

  // Create a mapping from categories (like "debugConsole") to color names (like
  // "errorForeground" or "progress.background")
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
    const category = entry[0]; // Example: "titleBar"
    const names = entry[1]; // Example: "border"

    // Hue for this category
    const categoryHue = Math.random() * 255;

    for (const name of names) {
      let customizeName = name;
      if (category.length > 0) {
        customizeName = category + "." + customizeName;
      }

      if (name === "background") {
        newColorCustomizations[customizeName] =
          generateBackgroundColor(background).toString();
        continue;
      }

      const saturation = Math.random();

      const lightness = getContrastLightness(background.lightness(), name);
      if (lightness === undefined) {
        // This problem is logged inside of getContrastLightness(), just skip
        // here without logging
        continue;
      }

      newColorCustomizations[customizeName] = Color.hsl(
        categoryHue,
        saturation,
        lightness
      ).toString();
    }
  }

  return newColorCustomizations;
}

function generateBackgroundColor(base: Color): Color {
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
    contrast = 2;
  } else if (name.toLowerCase().includes("foreground")) {
    contrast = 8;
  } else {
    contrast = 3;
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
