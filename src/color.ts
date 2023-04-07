function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

type RGB = {
  r: number;
  g: number;
  b: number;
};

type RGBA = RGB & {
  a: number;
};

// TODO : move to constant
const DEAD_COLOR = "#000000FF";

function rgbaToHex(color: RGBA): string {
  return (
    "#" +
    componentToHex(color.r) +
    componentToHex(color.g) +
    componentToHex(color.b) +
    componentToHex(color.a)
  );
}

function hexToRgba(hex: string): RGBA {
  switch (hex.length) {
    case 9: {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
        hex.toLowerCase()
      ) as RegExpExecArray;
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: parseInt(result[4], 16),
      };
    }
    case 7: {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
        hex.toLowerCase()
      ) as RegExpExecArray;
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 255,
      };
    }
    case 5: {
      var result = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(
        hex.toLowerCase()
      ) as RegExpExecArray;
      return {
        r: 16 * parseInt(result[1], 16),
        g: 16 * parseInt(result[2], 16),
        b: 16 * parseInt(result[3], 16),
        a: 16 * parseInt(result[4], 16),
      };
    }
    case 4: {
      var result = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(
        hex.toLowerCase()
      ) as RegExpExecArray;
      return {
        r: 16 * parseInt(result[1], 16),
        g: 16 * parseInt(result[2], 16),
        b: 16 * parseInt(result[3], 16),
        a: 255,
      };
    }
    default:
      return {
        r: 0,
        g: 0,
        b: 0,
        a: 0,
      };
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it("hexToRgba8", () => {
    expect(hexToRgba("#000000FF")).toStrictEqual({
      r: 0,
      g: 0,
      b: 0,
      a: 255,
    });
    expect(hexToRgba("#0FF000FF")).toStrictEqual({
      r: 15,
      g: 240,
      b: 0,
      a: 255,
    });
  });
  it("hexToRgba6", () => {
    expect(hexToRgba("#000FF0")).toStrictEqual({
      r: 0,
      g: 15,
      b: 240,
      a: 255,
    });
  });
  it("hexToRgba4", () => {
    expect(hexToRgba("#00AF")).toStrictEqual({
      r: 0,
      g: 0,
      b: 160,
      a: 240,
    });
  });
  it("hexToRgba3", () => {
    expect(hexToRgba("#0AF")).toStrictEqual({
      r: 0,
      g: 160,
      b: 240,
      a: 255,
    });
  });
}

export type MinMax = {
  min: { value: number; color: string };
  max: { value: number; color: string };
};

export function colorInterpolation(minMax: MinMax, alt: number): string {
  const colorMin = minMax.min.color;
  const colorMax = minMax.max.color;
  const hexMin = hexToRgba(colorMin);
  const hexMax = hexToRgba(colorMax);

  const interValue =
    (alt - minMax.min.value) / (minMax.max.value - minMax.min.value);

  const interColor = {
    r: Math.floor((1 - interValue) * hexMin.r + interValue * hexMax.r),
    g: Math.floor((1 - interValue) * hexMin.g + interValue * hexMax.g),
    b: Math.floor((1 - interValue) * hexMin.b + interValue * hexMax.b),
    a: Math.floor((1 - interValue) * hexMin.a + interValue * hexMax.a),
  };

  return rgbaToHex(interColor);
}

function nextRGBShade(color: RGB): RGB {
  // enchainement des couleurs  R G B
  //  B  - BG  - G   - GR  - R
  // 00F - 0FF - 0F0 - FF0 - F00
  // 255 * 4 + 1 = 1021
  // 0000FF -> 00FEFF : 255
  // 00FFFF -> 00FF01 : 255
  // 00FF00 -> FEFF00 : 255
  // FFFF00 -> FF0100 : 255
  // + FF0000
  if (color.b === 255 && color.g !== 255) {
    return { ...color, g: color.g + 1 };
  } else if (color.b !== 0 && color.g === 255) {
    return { ...color, b: color.b - 1 };
  } else if (color.b === 0 && color.g === 255 && color.r !== 255) {
    return { ...color, r: color.r + 1 };
  } else if (color.b === 0 && color.g !== 0 && color.r === 255) {
    return { ...color, g: color.g - 1 };
  } else {
    return {
      r: 255,
      g: 0,
      b: 0,
    };
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it("nextB", () => {
    expect(
      nextRGBShade({
        r: 0,
        g: 0,
        b: 255,
      })
    ).toStrictEqual({
      r: 0,
      g: 1,
      b: 255,
    });
  });
  it("nextGB", () => {
    expect(
      nextRGBShade({
        r: 0,
        g: 255,
        b: 255,
      })
    ).toStrictEqual({
      r: 0,
      g: 255,
      b: 254,
    });
  });
  it("nextG", () => {
    expect(
      nextRGBShade({
        r: 0,
        g: 255,
        b: 0,
      })
    ).toStrictEqual({
      r: 1,
      g: 255,
      b: 0,
    });
  });
  it("nextGR", () => {
    expect(
      nextRGBShade({
        r: 255,
        g: 255,
        b: 0,
      })
    ).toStrictEqual({
      r: 255,
      g: 254,
      b: 0,
    });
  });
  it("nextR", () => {
    expect(
      nextRGBShade({
        r: 255,
        g: 1,
        b: 0,
      })
    ).toStrictEqual({
      r: 255,
      g: 0,
      b: 0,
    });
  });
  it("nextRLimit", () => {
    expect(
      nextRGBShade({
        r: 255,
        g: 0,
        b: 0,
      })
    ).toStrictEqual({
      r: 255,
      g: 0,
      b: 0,
    });
  });
}

const BEGIN_RBG_SHADE = {
  r: 0,
  g: 0,
  b: 255,
};
const END_RBG_SHADE = {
  r: 255,
  g: 0,
  b: 0,
};

function deepEqual(object1: any, object2: any): boolean {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }
  return true;
}

function isObject(object: any) {
  return object != null && typeof object === "object";
}

const allColors = [BEGIN_RBG_SHADE];
let nextColor = nextRGBShade(BEGIN_RBG_SHADE);
while (!deepEqual(allColors[allColors.length - 1], nextColor)) {
  allColors.push(nextColor);
  nextColor = nextRGBShade(nextColor);
}

function convertToRGBShade(interValue: number): RGB {
  if (interValue < 0) {
    return hexToRgba(DEAD_COLOR) as RGB;
  }
  const h = 1 / allColors.length;
  const idx = Math.max(
    0,
    Math.min(allColors.length - 1, Math.round(interValue / h))
  );

  return allColors[idx];
}

if (import.meta.vitest) {
  const eps = 1e-6;
  const h = 1 / 1021;
  const { it, expect } = import.meta.vitest;
  it("zero", () => {
    expect(convertToRGBShade(0)).toStrictEqual({
      r: 0,
      g: 0,
      b: 255,
    });
  });
  it("increment", () => {
    expect(convertToRGBShade(h + eps)).toStrictEqual({
      r: 0,
      g: 1,
      b: 255,
    });
  });
  it("deux_increment", () => {
    expect(convertToRGBShade(2 * h + eps)).toStrictEqual({
      r: 0,
      g: 2,
      b: 255,
    });
  });
  it("increment_to_green", () => {
    expect(convertToRGBShade(255 * h + eps)).toStrictEqual({
      r: 0,
      g: 255,
      b: 255,
    });
  });
  it("full_green", () => {
    expect(convertToRGBShade(255 * 2 * h + eps)).toStrictEqual({
      r: 0,
      g: 255,
      b: 0,
    });
  });
  it("full_red", () => {
    expect(convertToRGBShade(1)).toStrictEqual({
      r: 255,
      g: 0,
      b: 0,
    });
  });
  it("over", () => {
    expect(convertToRGBShade(2)).toStrictEqual({
      r: 255,
      g: 0,
      b: 0,
    });
  });
}

function colorBarRGBShade(altMin: number, altMax: number, alt: number): string {
  const interValue = (alt - altMin) / (altMax - altMin);
  const rgb = convertToRGBShade(interValue);
  const rgba = { ...rgb, a: 255 };

  return rgbaToHex(rgba);
}

function colorBarRGBStep(
  altMin: number,
  altMax: number,
  alt: number,
  step: number = 200
): string {
  // Step size
  const altSteped = Math.floor(alt / step) * step;

  return colorBarRGBShade(altMin, altMax, altSteped);
}

export const altitudeMin = 0;
export const altitudeMax = 1800;
export const stepSize = 200;

export function colorBarRGB(
  altMin: number,
  altMax: number,
  alt: number,
  option: { style: string; step?: number } = { style: "step" }
): string {
  switch (option.style) {
    case "step": {
      return colorBarRGBStep(altMin, altMax, alt, option.step);
    }
    case "shade": {
      return colorBarRGBShade(altMin, altMax, alt);
    }
    default: {
      return colorBarRGBStep(altMin, altMax, alt);
    }
  }
}

type Color = { alt: number; color: string };

export type ColorBar = Color[];

export function colorBarInterpolation(config: ColorBar, alt: number): string {
  const colorBarSorted = config.sort(
    (color0, color1) => color0.alt - color1.alt
  );
  const colorMin = colorBarSorted.at(0) as Color;
  const colorMax = colorBarSorted.at(-1) as Color;
  const altMin = colorMin.alt;
  const altMax = colorMax.alt;

  // Deal with the extremity cases of the color bar
  if (alt < altMin) {
    // return colorMin.color;
    return DEAD_COLOR;
  } else if (altMax <= alt) {
    return colorMax.color;
  }

  // Find the segment of the input 'alt'
  let segment: Color[] = [];
  // console.log("colorBarSorted", colorBarSorted);
  // console.log("colorBarSorted.length", colorBarSorted.length);
  for (let i = 0; i < colorBarSorted.length - 1; i++) {
    // console.error("i", i);
    const color0 = colorBarSorted[i];
    const color1 = colorBarSorted[i + 1];
    // console.log("color0", color0);
    // console.log("color1", color1);
    // console.log("color0.alt", color0.alt);
    // console.log("color1.alt", color1.alt);
    // console.log("alt", alt);
    if (color0.alt <= alt && alt < color1.alt) {
      segment = [color0, color1];
      break;
    }
  }

  // return colorMax.color;

  // Do the interpolation of the 'alt' value in this segment
  const color0 = segment[0];
  const color1 = segment[1];
  const hexMin = hexToRgba(color0.color);
  const hexMax = hexToRgba(color1.color);

  // const interValue = (alt - color0.alt) / (color1.alt - color0.alt);
  const interValue = 0;

  const interColor = {
    r: Math.floor((1 - interValue) * hexMin.r + interValue * hexMax.r),
    g: Math.floor((1 - interValue) * hexMin.g + interValue * hexMax.g),
    b: Math.floor((1 - interValue) * hexMin.b + interValue * hexMax.b),
    a: Math.floor((1 - interValue) * hexMin.a + interValue * hexMax.a),
  };

  return rgbaToHex(interColor);

  // const colorMinColor = (config.colorBar.at(0) as Color).color;
  // const colorMaxColor = (config.colorBar.at(-1) as Color).color;
  // const hexMin = hexToRgba(colorMinColor);
  // const hexMax = hexToRgba(colorMaxColor);

  // const interValue = (alt - config.min) / (config.max - config.min);

  // const interColor = {
  //   r: Math.floor((1 - interValue) * hexMin.r + interValue * hexMax.r),
  //   g: Math.floor((1 - interValue) * hexMin.g + interValue * hexMax.g),
  //   b: Math.floor((1 - interValue) * hexMin.b + interValue * hexMax.b),
  //   a: Math.floor((1 - interValue) * hexMin.a + interValue * hexMax.a),
  // };

  // return rgbaToHex(interColor);
}
