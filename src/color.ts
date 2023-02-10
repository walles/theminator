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

  /**
   * @param hue 0-360
   * @param saturation 0-1
   * @param lightness 0-1
   */
  static hsl(hue: number, saturation: number, lightness: number): Color {
    // FIXME: The L here is lightness, but we want luminance!

    // Maths from here:
    // https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/

    if (saturation === 0) {
      const component = lightness * 255;
      return new Color(component, component, component);
    }

    let temporary1: number;
    if (lightness < 0.5) {
      temporary1 = lightness * (1 + saturation);
    } else {
      temporary1 = lightness + saturation - lightness * saturation;
    }

    const temporary2 = 2 * lightness - temporary1;

    hue /= 360;

    const temporaryR = (hue + 0.333) % 1;
    const temporaryG = hue;
    const temporaryB = (hue + 1 - 0.333) % 1;

    function toRgbComponent(temporaryX: number): number {
      if (6 * temporaryX < 1) {
        return temporary2 + (temporary1 - temporary2) * 6 * temporaryX;
      }
      if (2 * temporaryX < 1) {
        return temporary1;
      }
      if (3 * temporaryX < 2) {
        return (
          temporary2 + (temporary1 - temporary2) * (0.666 - temporaryR) * 6
        );
      }

      return temporary2;
    }

    return new Color(
      toRgbComponent(temporaryR) * 255,
      toRgbComponent(temporaryG) * 255,
      toRgbComponent(temporaryB) * 255
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

  lightness(): number {
    // FIXME: We want a luminance function, not lightness!
    // https://stackoverflow.com/a/9733420/473672

    // From:
    // https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
    return (
      (Math.max(this.r, this.g, this.g) + Math.min(this.r, this.g, this.b)) /
      2 /
      255
    );
  }

  contrast(other: Color): number {
    // Ref: https://stackoverflow.com/a/9733420/473672
    const lightness1 = this.lightness();
    const lightness2 = other.lightness();
    const brightest = Math.max(lightness1, lightness2);
    const darkest = Math.min(lightness1, lightness2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  toString(): string {
    return (
      "#" +
      Math.round(this.r).toString(16).padStart(2, "0") +
      Math.round(this.g).toString(16).padStart(2, "0") +
      Math.round(this.b).toString(16).padStart(2, "0")
    );
  }
}
