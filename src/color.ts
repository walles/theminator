export class Color {
  /** 0-255 */
  readonly r: number;

  /** 0-255 */
  readonly g: number;

  /** 0-255 */
  readonly b: number;

  private constructor(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  /** Generate a random color */
  static randomize(): Color {
    return new Color(
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    );
  }

  /**
   * @param hrrggbb Example: "#112233"
   * @returns hrrggbb parsed into a color
   */
  static parse(hrrggbb: string): Color {
    return new Color(
      parseInt(hrrggbb.substring(1, 3), 16),
      parseInt(hrrggbb.substring(3, 5), 16),
      parseInt(hrrggbb.substring(5, 7), 16)
    );
  }

  /** Create another color with the given contrast ratio against the base one. */
  static contrastRatio(
    base: Color,
    min: number | null,
    max: number | null
  ): Color {
    for (let i = 0; i < 30; i++) {
      const candidate = Color.randomize();
      const contrast = candidate.contrast(base);
      if (min !== null && contrast < min) {
        continue;
      }
      if (max !== null && contrast > max) {
        continue;
      }
      return candidate;
    }

    if (min === null) {
      console.error(
        `Failed to generate color with max contrast ${max} vs ${base}, falling back on the base color`
      );
      return base;
    }

    // FIXME: Fall back on the best one, not on a random one
    const fallback = Color.randomize();
    console.error(
      `Failed to generate color with contrast ${min}-${max} vs ${base}, falling back on ${fallback} with contrast ${fallback.contrast(
        base
      )}`
    );
    return fallback;
  }

  luminance(): number {
    // Ref: https://stackoverflow.com/a/9733420/473672
    const a = [this.r, this.g, this.b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  contrast(other: Color): number {
    // Ref: https://stackoverflow.com/a/9733420/473672
    const luminance1 = this.luminance();
    const luminance2 = other.luminance();
    const brightest = Math.max(luminance1, luminance2);
    const darkest = Math.min(luminance1, luminance2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  toString(): string {
    return (
      "#" +
      this.r.toString(16).padStart(2, "0") +
      this.g.toString(16).padStart(2, "0") +
      this.b.toString(16).padStart(2, "0")
    );
  }
}
