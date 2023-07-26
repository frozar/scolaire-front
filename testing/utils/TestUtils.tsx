import { LeafletMouseEvent } from "leaflet";
import { Component } from "solid-js";
import { StoryContext } from "storybook-solidjs";
import { useStateAction } from "../../src/StateAction";
import { NatureEnum, PointIdentityType } from "../../src/type";
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
export function createPointEtablissement(
  fullId: string,
  idPoint: number,
  lat: number,
  lon: number
) {
  return (
    <PointEtablissement
      idPoint={idPoint}
      lat={lat}
      lon={lon}
      isLast={false}
      isBlinking={false}
      map={initialiseMap(fullId)}
      onIsLast={() => console.log("onIsLast")}
      onClick={() => {
        onClickHandler({
          id: 50,
          idPoint,
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

export function createPointRamassage(
  fullId: string,
  idPoint: number,
  lat: number,
  lon: number
) {
  return (
    <PointRamassage
      quantity={6}
      minQuantity={1}
      maxQuantity={25}
      idPoint={idPoint}
      lat={lat}
      lon={lon}
      isLast={false}
      isBlinking={false}
      map={initialiseMap(fullId)}
      onIsLast={() => console.log("onIsLast")}
      onClick={() =>
        onClickHandler({
          id: 51,
          idPoint,
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
          {createPointRamassage(
            fullId,
            51,
            -20.9465588303741,
            55.5323806753509
          )}
          ,
          {createPointEtablissement(
            fullId,
            50,
            -20.9486587304741,
            55.5344806754509
          )}
          <Story />
        </div>
      </>
    );
  },
];
