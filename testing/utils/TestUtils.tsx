import { Component, createSignal } from "solid-js";
import { StoryContext } from "storybook-solidjs";
import { PointType } from "../../src/_entities/_utils.entity";
import { NatureEnum } from "../../src/type";
import { SchoolPoint } from "../../src/views/content/map/component/molecule/SchoolPoint";
import { StopPoint } from "../../src/views/content/map/component/molecule/StopPoint";
import { initialiseMap } from "./mapWrapper";

export function createPoint(
  pointInformation: {
    id: number;
    leafletId: number;
    lat: number;
    lon: number;
    name: string;
    nature: NatureEnum;
  },
  quantityOffset = 0
): PointType {
  const [selected, setSelected] = createSignal<boolean>(false);

  return {
    id: pointInformation.id,
    leafletId: pointInformation.leafletId,
    lat: pointInformation.lat,
    lon: pointInformation.lon,
    name: pointInformation.name,
    nature: pointInformation.nature,
    associated: [
      { id: 1, name: "Associated1", quantity: 3 },
      { id: 2, name: "Associated2", quantity: 5 + quantityOffset },
    ],
    selected: selected,
    setSelected: setSelected,
  };
}

type PointInformationWithMapInfos = {
  fullId: string;
  withTiles: boolean;
  leafletId: number;
} & PointType;

export function createSchoolPoint(
  pointmap: Omit<PointInformationWithMapInfos, "nature" | "associated">
) {
  const point = createPoint({
    id: 1,
    leafletId: pointmap.leafletId,
    lat: pointmap.lat,
    lon: pointmap.lon,
    name: pointmap.name,
    nature: NatureEnum.school,
  });

  return (
    <SchoolPoint
      school={point}
      map={initialiseMap(pointmap.fullId, pointmap.withTiles)}
    />
  );
}

export function createStopPoint(
  pointmap: Omit<PointInformationWithMapInfos, "nature" | "associated">
) {
  const point = createPoint({
    id: 1,
    leafletId: pointmap.leafletId,
    lat: pointmap.lat,
    lon: pointmap.lon,
    name: pointmap.name,
    nature: NatureEnum.stop,
  });
  return (
    <StopPoint
      point={point}
      minQuantity={1}
      maxQuantity={25}
      map={initialiseMap(pointmap.fullId, pointmap.withTiles)}
    />
  );
}

export function getDivFullId(options: StoryContext) {
  const name = options.name.replaceAll(" ", "-").toLowerCase();
  const mode = options.viewMode.toLowerCase();

  return `${mode}-${name}-map-container`;
}

export const decorators = [
  (Story: Component, options: StoryContext) => {
    const fullId = getDivFullId(options);

    return (
      <>
        <div id={fullId} style={{ width: "100%", height: "500px" }}>
          {createStopPoint({
            fullId: fullId,
            withTiles: true,
            id: 1,
            leafletId: 51,
            lat: -20.9465588303741,
            lon: 55.5323806753509,
            name: "name",
          })}
          ,
          {createSchoolPoint({
            fullId: fullId,
            withTiles: true,
            id: 1,
            leafletId: 50,
            lat: -20.9486587304741,
            lon: 55.5344806754509,
            name: "name",
          })}
          <Story />
        </div>
      </>
    );
  },
];

export const mapDecorators = [
  (Story: Component, options: StoryContext) => {
    const fullId = getDivFullId(options);

    return (
      <>
        <div id={fullId} style={{ width: "100%", height: "500px" }}>
          <Story />
        </div>
      </>
    );
  },
];
