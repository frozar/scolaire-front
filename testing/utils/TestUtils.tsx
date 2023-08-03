import { LeafletMouseEvent } from "leaflet";
import { Component, createSignal } from "solid-js";
import { StoryContext } from "storybook-solidjs";
import { useStateAction } from "../../src/StateAction";
import { NatureEnum, PointIdentityType } from "../../src/type";
import {
  PointInformation,
  PointInterface,
} from "../../src/views/content/graphicage/component/atom/Point";
import PointEtablissement from "../../src/views/content/graphicage/component/molecule/PointEtablissement";
import PointRamassage from "../../src/views/content/graphicage/component/molecule/PointRamassage";
import { initialiseMap } from "./mapWrapper";
const [, { addPointToLineUnderConstruction }] = useStateAction();

//TODO replace this with the real handler
function onClickHandler(point: PointIdentityType) {
  const pointIdentity: PointIdentityType = {
    id: point.id,
    idPoint: point.idPoint,
    nature: point.nature,
  };

  addPointToLineUnderConstruction(pointIdentity);
}

export const createPoint = (pointInformation: PointInformation) => {
  const [associatedPoint, setAssociatedPoint] = createSignal<
    PointIdentityType[]
  >([]);
  const [selected, setSelected] = createSignal<boolean>(false);

  const point: PointInterface = {
    id: pointInformation.id,
    idPoint: pointInformation.idPoint,
    lat: pointInformation.lat,
    lon: pointInformation.lon,
    name: pointInformation.name,
    quantity: pointInformation.quantity,
    associatedPoints: associatedPoint,
    setAssociatedPoints: setAssociatedPoint,
    selected: selected,
    setSelected: setSelected,
  };

  return point;
};

interface PointInformationWithMapID extends PointInformation {
  fullId: string;
}

export function createPointEtablissement(pointmap: PointInformationWithMapID) {
  const point = createPoint({
    id: 1,
    idPoint: pointmap.idPoint as number,
    lat: pointmap.lat,
    lon: pointmap.lon,
    name: pointmap.name,
    quantity: pointmap.quantity,
  });

  return (
    <PointEtablissement
      point={point}
      map={initialiseMap(pointmap.fullId)}
      onClick={() => {
        onClickHandler({
          id: 50,
          idPoint: pointmap.idPoint,
          nature: NatureEnum.etablissement,
        });
      }}
      onDBLClick={(event: LeafletMouseEvent) =>
        console.log("onDBLClick, event:", event)
      }
      onMouseOver={() => console.log("onMouseOver")}
      onMouseOut={() => console.log("onMouseOut")}
    />
  );
}

export function createPointRamassage(pointmap: PointInformationWithMapID) {
  const point = createPoint({
    id: 1,
    idPoint: pointmap.idPoint,
    lat: pointmap.lat,
    lon: pointmap.lon,
    name: pointmap.name,
    quantity: pointmap.quantity,
  });
  return (
    <PointRamassage
      point={point}
      minQuantity={1}
      maxQuantity={25}
      map={initialiseMap(pointmap.fullId)}
      onClick={() =>
        onClickHandler({
          id: 51,
          idPoint: pointmap.idPoint,
          nature: NatureEnum.ramassage,
        })
      }
      onDBLClick={(event: LeafletMouseEvent) =>
        console.log("onDBLClick, event:", event)
      }
      onMouseOver={() => console.log("onMouseOver")}
      onMouseOut={() => console.log("onMouseOut")}
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
          {createPointRamassage({
            fullId: fullId,
            id: 1,
            idPoint: 51,
            lat: -20.9465588303741,
            lon: 55.5323806753509,
            name: "name",
            quantity: 15,
          })}
          ,
          {createPointEtablissement({
            fullId: fullId,
            id: 1,
            idPoint: 50,
            lat: -20.9486587304741,
            lon: 55.5344806754509,
            name: "name",
            quantity: 15,
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
