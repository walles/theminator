import * as assert from "assert";

import { Color } from "../../color";
import { generateColors } from "../../colorsGenerator";
import { keys } from "../../keys";

suite("Color Generator", () => {
  test("No unknown keys configured", () => {
    const background = Color.hueSaturationLightness(0, 0, 0);
    const generatedColors = generateColors(background, keys);
    for (const key in generatedColors) {
      assert.equal(keys.includes(key), true);
    }
  });

  test('All "tab." keys configured', () => {
    // These are always on screen, they must work
    const background = Color.hueSaturationLightness(0, 0, 0);
    const generatedColors = generateColors(background, keys);

    const coveredTabKeys = new Set<string>();
    for (const key in generatedColors) {
      if (!key.startsWith("tab.")) {
        continue;
      }
      coveredTabKeys.add(key);
    }

    const notCoveredTabKeys = [];
    for (const key of keys) {
      if (!key.startsWith("tab.")) {
        continue;
      }
      if (coveredTabKeys.has(key)) {
        continue;
      }
      notCoveredTabKeys.push(key);
    }

    assert.equal(
      notCoveredTabKeys.length,
      0,
      `Not covered tab keys:\n${notCoveredTabKeys.join("\n")}`
    );
  });
});
