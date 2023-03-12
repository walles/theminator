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

  fillInTabColors(keys, newColorCustomizations);

  warnAboutMissingCustomizations(newColorCustomizations, keys);

  return newColorCustomizations;
}

function warnAboutMissingCustomizations(
  customizations: Record<string, string>,
  allKeys: string[]
) {
  const percentDone = Math.floor(
    (100 * Object.keys(customizations).length) / allKeys.length
  );
  console.log(
    `Colors generated for ${Object.keys(customizations).length}/${
      allKeys.length
    }, or ${percentDone}%`
  );

  const notDonePrefixCounts: Record<string, number> = {};
  const notDoneSuffixCounts: Record<string, number> = {};
  for (const key of allKeys) {
    if (customizations[key] !== undefined) {
      // Already done, never mind
      continue;
    }

    const prefix = key.split(".")[0];
    const suffix = key.split(".")[key.split(".").length - 1];
    notDonePrefixCounts[prefix] = (notDonePrefixCounts[prefix] || 0) + 1;
    notDoneSuffixCounts[suffix] = (notDoneSuffixCounts[suffix] || 0) + 1;
  }

  // Ref: https://stackoverflow.com/a/27376421/473672
  const topNotDonePrefix = Object.keys(notDonePrefixCounts).reduce((a, b) =>
    notDonePrefixCounts[a] > notDonePrefixCounts[b] ? a : b
  );
  const topNotDoneSuffix = Object.keys(notDoneSuffixCounts).reduce((a, b) =>
    notDoneSuffixCounts[a] > notDoneSuffixCounts[b] ? a : b
  );

  console.log(
    `The top not-done prefix is "${topNotDonePrefix}", it contains ${notDonePrefixCounts[topNotDonePrefix]} keys`
  );
  console.log(
    `The top not-done suffix is "${topNotDoneSuffix}", we have ${notDoneSuffixCounts[topNotDoneSuffix]} of those`
  );
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
  if (background.perceivedLightness() > 0.5) {
    lightness = 0.1;
  }

  return Color.hueSaturationLightness(hue, saturation, lightness);
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
    // Base color is greyscale, let's not add any color to that
    saturation = 0;
  } else if (saturation < 0) {
    saturation = 0;
  } else if (saturation > 1) {
    saturation = 1;
  }

  let lightness =
    base.lightness() - lightnessRadius + Math.random() * lightnessRadius * 2;
  if (lightness < 0) {
    lightness = 0;
  } else if (lightness > 1) {
    lightness = 1;
  }

  return Color.hueSaturationLightness(hue, saturation, lightness);
}

/**
 * Generate a suitable color for some tab entry.
 *
 * @param key Example: "tab.inactiveModifiedBorder"
 * @param background Global background color
 * @param foreground Global foreground color
 */
function fillInTabColors(
  allKeys: string[],
  customizations: Record<string, string>
) {
  for (const key of [
    "activeBackground",
    "unfocusedActiveBackground",
    "hoverBackground",
  ]) {
    customizations["tab." + key] = customizations["editor.background"];
  }
  for (const key of [
    "activeForeground",
    "unfocusedActiveForeground",
    "hoverForeground",
  ]) {
    customizations["tab." + key] = customizations["editor.foreground"];
  }
}
