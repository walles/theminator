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
   * @param lightness 0-1. Matches with the lightness() method.
   */
  static hueSaturationLightness(
    hue: number,
    saturation: number,
    lightness: number
  ): Color {
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

  static createInBetween(
    color1: Color,
    color2: Color,
    zeroToOne: number
  ): Color {
    const c1amount = 1 - zeroToOne;
    const c2amount = zeroToOne;
    return new Color(
      color1.r * c1amount + color2.r * c2amount,
      color1.g * c1amount + color2.g * c2amount,
      color1.b * c1amount + color2.b * c2amount
    );
  }

  /** 0-360 */
  hue(): number {
    // Source: https://stackoverflow.com/a/26233318/473672

    const min = this.min();
    const max = this.max();

    if (min === max) {
      return 0;
    }

    let hue = 0;
    if (max === this.r) {
      hue = (this.g - this.b) / (max - min);
    } else if (max === this.g) {
      hue = 2 + (this.b - this.r) / (max - min);
    } else {
      hue = 4 + (this.r - this.g) / (max - min);
    }

    hue *= 60;
    if (hue < 0) {
      hue += 360;
    }

    return hue;
  }

  /** 0-1 */
  saturation(): number {
    // From: https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/

    if (this.lightness() === 0) {
      return 0;
    }

    const d = (this.max() - this.min()) / 255;
    if (d === 0) {
      return 0;
    }

    return d / (1 - Math.abs(2 * this.lightness() - 1));
  }

  /**
   * 0-1.
   *
   * Matches with the hueSaturationLightness() method.
   *
   * Not to be confused with perceivedLightness().
   */
  lightness(): number {
    // From:
    // https://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
    return (this.max() + this.min()) / 2 / 255;
  }

  /** 0-1 */
  luminance(): number {
    // Maths from here: https://stackoverflow.com/a/56678483/473672
    const vR = this.r / 255;
    const vG = this.g / 255;
    const vB = this.b / 255;

    /** 0-1 => 0-1 */
    function sRGBtoLin(colorChannel: number): number {
      if (colorChannel <= 0.04045) {
        return colorChannel / 12.92;
      } else {
        return Math.pow((colorChannel + 0.055) / 1.055, 2.4);
      }
    }

    return (
      0.2126 * sRGBtoLin(vR) + 0.7152 * sRGBtoLin(vG) + 0.0722 * sRGBtoLin(vB)
    );
  }

  /**
   * 0-1
   *
   * Not to be confused with lightness().
   */
  perceivedLightness(): number {
    // Maths from here: https://stackoverflow.com/a/56678483/473672
    const rawLuminance = this.luminance();
    if (rawLuminance <= 216 / 24389) {
      return rawLuminance * (24389 / 27);
    } else {
      return Math.pow(rawLuminance, 1 / 3) * 1.16 - 0.16;
    }
  }

  /** Maximum RGB component, 0-255 */
  max(): number {
    return Math.max(this.r, this.g, this.b);
  }

  /** Minimum RGB component, 0-255 */
  min(): number {
    return Math.min(this.r, this.g, this.b);
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
