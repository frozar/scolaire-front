import { colorBarRGB, altitudeMin, altitudeMax, stepSize } from "./color";

type TronconSource = {
  id: number;
  cleabs: string;
  the_geom: string;
  length_m: number;
};

type Properties = Omit<TronconSource, "the_geom"> & {
  color: string;
};

type TronconTarget = {
  geometry: { type: string; coordinates: number[][] };
  properties: Properties;
  type: string;
};

export type L7Format = {
  crs: { properties: { name: string }; type: string };
  features: TronconTarget[];
  name: string;
  type: string;
};

type Geometry = {
  coordinates: number[][];
  type: string;
};

function colorNature(nature: string): string {
  switch (nature) {
    case "Sentier":
      return "#F9D371";
    case "Bac ou liaison maritime":
      return "#3DB2FF";
    case "Bretelle":
      return "#6E85B2";
    case "Chemin":
      return "#F47340";
    case "Escalier":
      return "#5F7A61";
    case "Piste cyclable":
      return "#F6A9A9";
    case "Rond-point":
      return "#EF2F88";
    case "Route à 1 chaussée":
      return "red";
    case "Route à 2 chaussées":
      return "green";
    case "Route empierrée":
      return "#FFF89A";
    case "Type autoroutier":
      return "#00FF00";
    default:
      return "#FFE3E3";
  }
}

function colorLineString(coordinates: number[][]) {
  const z1 = (coordinates.at(0) as number[]).at(-1) as number;
  const z2 = (coordinates.at(-1) as number[]).at(-1) as number;
  const zAverage = (z1 + z2) / 2;

  return colorBarRGB(altitudeMin, altitudeMax, zAverage, {
    style: "step",
    step: stepSize,
  });
}

function colorAltimetryStep(sourceObject: TronconSource): TronconTarget {
  const geometryOrigin = JSON.parse(sourceObject.the_geom);
  let geomWithoutZ = { ...geometryOrigin };
  geomWithoutZ["coordinates"] = geomWithoutZ.coordinates.map(
    (elt: Array<number>) => elt.slice(0, 2)
  );
  // TODO: deal with different type of features
  let { the_geom: _, ...sourceObjectWihtoutTheGeom } = sourceObject;

  return {
    geometry: geomWithoutZ,
    properties: {
      ...sourceObjectWihtoutTheGeom,
      color: colorLineString(geometryOrigin.coordinates),
    },
    type: "Feature",
  };
}

function cutTroncon(troncon: number[][], step: number): number[][][] {
  if (troncon.length === 0) {
    return [troncon];
  }

  // Build the different segment
  const segments: number[][][] = [];
  let currentQuotient = Math.floor(troncon[0][2] / step);
  let currentSegment: number[][] = [];
  for (let point of troncon) {
    const candidatQuotient = Math.floor(point[2] / step);
    if (currentQuotient === candidatQuotient) {
      currentSegment.push(point);
    } else {
      if (currentQuotient < candidatQuotient) {
        currentQuotient = candidatQuotient;
        currentSegment.push(point);
        segments.push(currentSegment);
        currentSegment = [point];
      } else if (candidatQuotient < currentQuotient) {
        currentQuotient = candidatQuotient;
        // currentSegment.push(point);
        const lastPoint = currentSegment[currentSegment.length - 1];
        segments.push(currentSegment);
        currentSegment = [lastPoint, point];
      }
    }
  }

  // Don't forget the last segment
  if (1 <= currentSegment.length) {
    segments.push(currentSegment);
  }

  return segments;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const step = 200;
  it("cutTronconEmpty", () => {
    expect(cutTroncon([], step)).toStrictEqual([[]]);
  });
  it("cutTronconIdentity", () => {
    expect(
      cutTroncon(
        [
          [0, 0, 197],
          [0, 0, 198],
          [0, 0, 199],
        ],
        step
      )
    ).toStrictEqual([
      [
        [0, 0, 197],
        [0, 0, 198],
        [0, 0, 199],
      ],
    ]);
  });
  it("cutTroncon2Part", () => {
    expect(
      cutTroncon(
        [
          [0, 0, 197],
          [0, 0, 198],
          [0, 0, 199],
          [0, 0, 200],
          [0, 0, 201],
          [0, 0, 202],
        ],
        step
      )
    ).toStrictEqual([
      [
        [0, 0, 197],
        [0, 0, 198],
        [0, 0, 199],
        [0, 0, 200],
      ],
      [
        [0, 0, 200],
        [0, 0, 201],
        [0, 0, 202],
      ],
    ]);
  });
  it("cutTronconFirstExtremity", () => {
    expect(
      cutTroncon(
        [
          [0, 0, 200],
          [0, 0, 199],
          [0, 0, 198],
          [0, 0, 197],
        ],
        step
      )
    ).toStrictEqual([
      [[0, 0, 200]],
      [
        [0, 0, 200],
        [0, 0, 199],
        [0, 0, 198],
        [0, 0, 197],
      ],
    ]);
  });
  it("cutTronconLastExtremity", () => {
    expect(
      cutTroncon(
        [
          [0, 0, 197],
          [0, 0, 198],
          [0, 0, 199],
          [0, 0, 200],
        ],
        step
      )
    ).toStrictEqual([
      [
        [0, 0, 197],
        [0, 0, 198],
        [0, 0, 199],
        [0, 0, 200],
      ],
      [[0, 0, 200]],
    ]);
  });
  it("cutTroncon3Part", () => {
    expect(
      cutTroncon(
        [
          [0, 0, 197],
          [0, 0, 198],
          [0, 0, 199],
          [0, 0, 200],
          [0, 0, 199],
          [0, 0, 198],
          [0, 0, 197],
        ],
        step
      )
    ).toStrictEqual([
      [
        [0, 0, 197],
        [0, 0, 198],
        [0, 0, 199],
        [0, 0, 200],
      ],
      [[0, 0, 200]],
      [
        [0, 0, 200],
        [0, 0, 199],
        [0, 0, 198],
        [0, 0, 197],
      ],
    ]);
  });
}

function mergeTroncon(segments: number[][][]): number[][][] {
  const merged_segments: number[][][] = [];
  // Avoid segment of the length == 1
  let idxSegments = 0;
  while (idxSegments < segments.length) {
    // console.log("while idxSegments", idxSegments);
    // console.log("AA merged_segments", merged_segments);
    let segment = segments[idxSegments];
    // console.log("segment", segment);
    if (1 < segment.length) {
      merged_segments.push(segment);
      idxSegments += 1;
    } else {
      const currentLastIndex = merged_segments.length - 1;
      // console.log("currentLastIndex", currentLastIndex);
      // console.log("segments.length", segments.length);
      // console.log("segments.length - 1", segments.length - 1);
      if (0 <= currentLastIndex && currentLastIndex < segments.length - 2) {
        // console.log("PASS 0");
        const nextSegment = segments[idxSegments + 1].slice(1);
        const lastSegment = merged_segments[currentLastIndex].concat(
          // segment,
          nextSegment
        );
        merged_segments[currentLastIndex] = lastSegment;
        idxSegments += 2;
      } else if (currentLastIndex < 0) {
        // console.log("PASS 1");
        // console.log("idxSegments + 1", idxSegments + 1);
        // console.log("segments.length - 1", segments.length - 1);
        if (idxSegments + 1 <= segments.length - 1) {
          const nextSegment = segments[idxSegments + 1];
          // segment = segment.concat(nextSegment);
          segment = nextSegment;
          merged_segments.push(segment);
          idxSegments += 2;
        } else {
          merged_segments.push(segment);
          idxSegments += 1;
        }
      } else if (currentLastIndex === segments.length - 2) {
        // console.log("PASS 2");
        // const lastSegment = merged_segments[currentLastIndex].concat(segment);
        const lastSegment = merged_segments[currentLastIndex];
        merged_segments[currentLastIndex] = lastSegment;
        idxSegments += 1;
      }
    }
    // console.log("BB merged_segments", merged_segments);
    // console.log("while merged_segments", merged_segments);
  }

  return merged_segments;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it("mergeTronconEmpty", () => {
    expect(mergeTroncon([[]])).toStrictEqual([[]]);
  });
  it("mergeTronconEmptyAndTroncon", () => {
    expect(
      mergeTroncon([
        [],
        [
          [0, 0, 197],
          [0, 0, 198],
          [0, 0, 199],
        ],
      ])
    ).toStrictEqual([
      [
        [0, 0, 197],
        [0, 0, 198],
        [0, 0, 199],
      ],
    ]);
  });
  it("mergeTronconTronconAndEmpty", () => {
    expect(
      mergeTroncon([
        [
          [0, 0, 197],
          [0, 0, 198],
          [0, 0, 199],
        ],
        [],
      ])
    ).toStrictEqual([
      [
        [0, 0, 197],
        [0, 0, 198],
        [0, 0, 199],
      ],
    ]);
  });
  it("mergeTronconIdentity", () => {
    expect(
      mergeTroncon([
        [
          [0, 0, 197],
          [0, 0, 198],
          [0, 0, 199],
        ],
      ])
    ).toStrictEqual([
      [
        [0, 0, 197],
        [0, 0, 198],
        [0, 0, 199],
      ],
    ]);
  });
  it("mergeTroncon2Part", () => {
    expect(
      mergeTroncon([
        [
          [0, 0, 197],
          [0, 0, 198],
          [0, 0, 199],
          [0, 0, 200],
        ],
        [
          [0, 0, 200],
          [0, 0, 201],
          [0, 0, 202],
        ],
      ])
    ).toStrictEqual([
      [
        [0, 0, 197],
        [0, 0, 198],
        [0, 0, 199],
        [0, 0, 200],
      ],
      [
        [0, 0, 200],
        [0, 0, 201],
        [0, 0, 202],
      ],
    ]);
  });
  it("mergeTronconFirstExtremity", () => {
    expect(
      mergeTroncon([
        [[0, 0, 200]],
        [
          [0, 0, 200],
          [0, 0, 199],
          [0, 0, 198],
          [0, 0, 197],
        ],
      ])
    ).toStrictEqual([
      [
        [0, 0, 200],
        [0, 0, 199],
        [0, 0, 198],
        [0, 0, 197],
      ],
    ]);
  });
  it("mergeTronconLastExtremity", () => {
    expect(
      mergeTroncon([
        [
          [0, 0, 197],
          [0, 0, 198],
          [0, 0, 199],
          [0, 0, 200],
        ],
        [[0, 0, 200]],
      ])
    ).toStrictEqual([
      [
        [0, 0, 197],
        [0, 0, 198],
        [0, 0, 199],
        [0, 0, 200],
      ],
    ]);
  });
  it("mergeTronconInMiddle", () => {
    expect(
      mergeTroncon([
        [
          [0, 0, 197],
          [0, 0, 198],
          [0, 0, 199],
          [0, 0, 200],
        ],
        [[0, 0, 200]],
        [
          [0, 0, 200],
          [0, 0, 199],
          [0, 0, 198],
          [0, 0, 197],
        ],
      ])
    ).toStrictEqual([
      [
        [0, 0, 197],
        [0, 0, 198],
        [0, 0, 199],
        [0, 0, 200],
        [0, 0, 199],
        [0, 0, 198],
        [0, 0, 197],
      ],
    ]);
  });
  it("mergeTronconStayIn3Part", () => {
    expect(
      mergeTroncon([
        [
          [0, 0, 197],
          [0, 0, 198],
          [0, 0, 199],
          [0, 0, 200],
        ],
        [
          [0, 0, 200],
          [0, 0, 201],
        ],
        [
          [0, 0, 201],
          [0, 0, 199],
          [0, 0, 198],
          [0, 0, 197],
        ],
      ])
    ).toStrictEqual([
      [
        [0, 0, 197],
        [0, 0, 198],
        [0, 0, 199],
        [0, 0, 200],
      ],
      [
        [0, 0, 200],
        [0, 0, 201],
      ],
      [
        [0, 0, 201],
        [0, 0, 199],
        [0, 0, 198],
        [0, 0, 197],
      ],
    ]);
  });
}

function cutAndMergeTroncon(line: number[][], step: number): number[][][] {
  const segments = cutTroncon(line, step);
  const merged_segments = mergeTroncon(segments);
  return merged_segments;
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  const step = 200;
  it("cutAndMergeTronconEmpty", () => {
    expect(cutAndMergeTroncon([], step)).toStrictEqual([[]]);
  });
  it("cutAndMergeTronconIdentity", () => {
    expect(
      cutAndMergeTroncon(
        [
          [0, 0, 197],
          [0, 0, 198],
          [0, 0, 199],
        ],
        step
      )
    ).toStrictEqual([
      [
        [0, 0, 197],
        [0, 0, 198],
        [0, 0, 199],
      ],
    ]);
  });
  it("cutAndMergeTroncon2Part", () => {
    expect(
      cutAndMergeTroncon(
        [
          [0, 0, 197],
          [0, 0, 198],
          [0, 0, 199],
          [0, 0, 200],
          [0, 0, 201],
          [0, 0, 202],
        ],
        step
      )
    ).toStrictEqual([
      [
        [0, 0, 197],
        [0, 0, 198],
        [0, 0, 199],
        [0, 0, 200],
      ],
      [
        [0, 0, 200],
        [0, 0, 201],
        [0, 0, 202],
      ],
    ]);
  });
  it("cutAndMergeTroncon2PointAtLeast", () => {
    expect(
      cutAndMergeTroncon(
        [
          [0, 0, 197],
          [0, 0, 198],
          [0, 0, 199],
          [0, 0, 200],
          [0, 0, 199],
          [0, 0, 198],
          [0, 0, 197],
        ],
        step
      )
    ).toStrictEqual([
      [
        [0, 0, 197],
        [0, 0, 198],
        [0, 0, 199],
        [0, 0, 200],
        [0, 0, 199],
        [0, 0, 198],
        [0, 0, 197],
      ],
    ]);
  });
  it("cutAndMergeTroncon2PointAtLeastFirstPosition", () => {
    expect(
      cutAndMergeTroncon(
        [
          [0, 0, 200],
          [0, 0, 199],
          [0, 0, 198],
          [0, 0, 197],
        ],
        step
      )
    ).toStrictEqual([
      [
        [0, 0, 200],
        [0, 0, 199],
        [0, 0, 198],
        [0, 0, 197],
      ],
    ]);
  });
  it("cutAndMergeTroncon2PointAtLeastLastPosition", () => {
    expect(
      cutAndMergeTroncon(
        [
          [0, 0, 197],
          [0, 0, 198],
          [0, 0, 199],
          [0, 0, 200],
        ],
        step
      )
    ).toStrictEqual([
      [
        [0, 0, 197],
        [0, 0, 198],
        [0, 0, 199],
        [0, 0, 200],
      ],
    ]);
  });
}

// function cutAndColorAltimetryStep(sourceObject: TronconSource): TronconTarget {
//   const geometryOrigin: Geometry = JSON.parse(sourceObject.the_geom);
//   // TODO: split the geometryOrigin.coordinates with 'cutLine'
//   let geomWithoutZ = { ...geometryOrigin };
//   const segments = cutAndMergeTroncon(geomWithoutZ["coordinates"], 200);
//   geomWithoutZ["coordinates"] = geomWithoutZ.coordinates.map(
//     (elt: Array<number>) => elt.slice(0, 2)
//   );

//   let { the_geom: _, ...sourceObjectWihtoutTheGeom } = sourceObject;

//   return {
//     geometry: geomWithoutZ,
//     properties: {
//       ...sourceObjectWihtoutTheGeom,
//       color: colorLineString(geometryOrigin.coordinates),
//     },
//     type: "Feature",
//   };
// }

// function sourceToTarget(sourceObject: TronconSource): TronconTarget {
//   const colorStyle = "AltimetryStep";

//   switch (colorStyle) {
//     case "AltimetryStep": {
//       return cutAndColorAltimetryStep(sourceObject);
//     }
//     default:
//       return colorAltimetryStep(sourceObject);
//   }
// }

export function dataToL7Format(tronconsSource: TronconSource[]): L7Format {
  // const features = tronconsSource.map(sourceToTarget);
  // console.log("features", [...features]);
  // console.log("features[0]", features[0]);
  // console.log("features[0].geometry", features[0].geometry);
  const features: TronconTarget[] = [];
  for (let troncon of tronconsSource) {
    const geometryOrigin: Geometry = JSON.parse(troncon.the_geom);
    // TODO: fix the call to the function 'cutAndMergeTroncon' for the post code 97402
    // const segments = cutAndMergeTroncon(geometryOrigin["coordinates"], 200);
    const segments = [geometryOrigin["coordinates"]];

    // const nbPtOrigin = geometryOrigin["coordinates"].length;
    // const nbPtAfterCut = segments.reduce(
    //   (partialSum, segment) => partialSum + segment.length,
    //   0
    // );
    // console.assert(
    //   nbPtOrigin === nbPtAfterCut,
    //   "The number of points after cut is not the same"
    // );

    // const segmentsWithoutZ = segments.map(segment => segment.map(point => point.slice(0, 2)));
    for (let segment of segments) {
      const segmentWithoutZ = segment.map((point) => point.slice(0, 2));
      let { the_geom: _, ...tronconWithoutTheGeom } = troncon;
      features.push({
        geometry: { ...geometryOrigin, coordinates: segmentWithoutZ },
        properties: {
          ...tronconWithoutTheGeom,
          // color: colorLineString(geometryOrigin.coordinates),
          color: colorLineString(segment),
        },
        type: "Feature",
      });
    }
  }
  return {
    crs: {
      // properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      properties: { name: "urn:ogc:def:crs:EPSG::4326" },
      type: "name",
    },
    features,
    name: "dl2",
    type: "FeatureCollection",
  };
}
