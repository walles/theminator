import * as assert from "assert";

import { Color } from "../../color";

suite("Color Test Suite", () => {
  test("HSL", () => {
    const color = Color.hsl(42, 0.3, 0.7);

    assert.ok(color.r >= 0 && color.r < 256);
    assert.ok(color.g >= 0 && color.g < 256);
    assert.ok(color.b >= 0 && color.b < 256);

    assert.equal(Math.round(color.hue()), 42);
    assert.equal(color.lightness(), 0.7);
    assert.equal(color.toString(), "#c9bc9c");
  });
});
