import { For, createEffect, createSignal, onCleanup, onMount } from "solid-js";

import L, { LeafletMouseEvent } from "leaflet";
import { useStateAction } from "../../../StateAction";
import { useStateGui } from "../../../StateGui";
import {
  getLeafletMap,
  points,
  setIsEtablissementReady,
  setIsRamassageReady,
  setPoints,
} from "../../../signaux";
import {
  EleveVersEtablissementType,
  NatureEnum,
  PointEtablissementDBType,
  PointEtablissementType,
  PointIdentityType,
  PointRamassageCoreType,
  PointRamassageDBType,
  PointRamassageType,
} from "../../../type";
import { authenticateWrap } from "../../layout/authentication";
import { renderAnimation } from "./animation";
import { deselectAllBusLines } from "./line/busLinesUtils";
import Point, { linkMap } from "./point/atom/Point";
import { selectPointById } from "./pointUtils";

const [, { getActiveMapId }] = useStateGui();
const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    isInAddLineMode,
  },
] = useStateAction();

export const [pointsReady, setPointsReady] = createSignal(false);

export const [pointsEtablissement, setPointsEtablissement] = createSignal<
  PointEtablissementType[]
>([]);
export const [pointsRamassage, setPointsRamassage] = createSignal<
  PointEtablissementType[]
>([]);

const [pointsRamassageReady, setPointsRamassageReady] = createSignal(false);
const [pointsEtablissementReady, setPointsEtablissementReady] =
  createSignal(false);

createEffect(() => {
  if (pointsRamassageReady() && pointsEtablissementReady()) {
    setPointsReady(true);
  }
});

// Rename field 'id_point' to 'idPoint'
function PointBack2FrontIdPoint(
  data: PointRamassageDBType
): PointRamassageCoreType {
  const dataWk = {
    ...data,
    idPoint: data.id_point,
  } as PointRamassageCoreType & { id_point?: number };
  delete dataWk["id_point"];

  console.assert(dataWk["idPoint"] != undefined, "idPoint is undefined");

  return dataWk;
}

function PointBack2Front<
  T extends PointRamassageDBType | PointEtablissementDBType
>(
  datas: T[],
  nature: NatureEnum
): PointRamassageType[] | PointEtablissementType[] {
  return (
    datas
      // Rename "id_point" -> "idPoint"
      .map((data) => PointBack2FrontIdPoint(data))
      // Add signal "selected"
      .map((data) => {
        const [selected, setSelected] = createSignal(false);
        const [associatedPoints, setAssociatedPoints] = createSignal<
          PointIdentityType[]
        >([]);
        return {
          ...data,
          selected,
          setSelected,
          associatedPoints,
          setAssociatedPoints,
        } as PointRamassageType;
      })

      .map((data) => ({ ...data, nature }))
  );
}

export function fetchPointsRamassageAndEtablissement() {
  authenticateWrap((headers) => {
    setPointsRamassageReady(false);
    setPointsEtablissementReady(false);

    const mapId = getActiveMapId();

    if (mapId) {
      fetch(
        import.meta.env.VITE_BACK_URL + `/map/${mapId}/dashboard/ramassage`,
        {
          headers,
        }
      ).then(async (res) => {
        const json = await res.json();
        // console.log("json", json);

        const datas: PointRamassageDBType[] = json["content"];
        console.log("Ramassage datas", datas);

        const dataWk = PointBack2Front(
          datas,
          NatureEnum.ramassage
        ) as PointRamassageType[];
        console.log("Ramassage: dataWk", dataWk);

        setPoints((dataArray) => [...dataArray, ...dataWk]);
        setPointsRamassage((dataArray) => [...dataArray, ...dataWk]);
        setPointsRamassageReady(true);
      });

      fetch(
        import.meta.env.VITE_BACK_URL + `/map/${mapId}/dashboard/etablissement`,
        {
          headers,
        }
      ).then(async (res) => {
        const json = await res.json();
        const datas: PointEtablissementDBType[] = json["content"];

        const dataWk = PointBack2Front(
          datas,
          NatureEnum.etablissement
        ) as PointEtablissementType[];
        console.log("Etablissement: dataWk", dataWk);

        setPointsEtablissement((dataArray) => [...dataArray, ...dataWk]);
        setPoints((dataArray) => [...dataArray, ...dataWk]);

        setPointsEtablissementReady(true);
      });
    }
  });
}

export default function () {
  onMount(() => {
    fetchPointsRamassageAndEtablissement();
    fetchEleveVersEtablissement();
  });

  onCleanup(() => {
    setPoints([]);
    setIsRamassageReady(false);
    setIsEtablissementReady(false);
  });

  return (
    <For each={points()}>
      {(point, i) => {
        const onClick = () => {
          // Select the current element to display information
          if (!isInAddLineMode()) {
            deselectAllBusLines();
            selectPointById(point.idPoint);
            return;
          }

          const pointIdentity: PointIdentityType = {
            id: point.id,
            idPoint: point.idPoint,
            nature: point.nature,
          };

          addPointToLineUnderConstruction(pointIdentity);

          if (!(1 < getLineUnderConstruction().stops.length)) {
            return;
          }

          // Highlight point ramassage
          for (const associatedPoint of point.associatedPoints()) {
            let element;
            if (
              (element = linkMap.get(associatedPoint.idPoint)?.getElement())
            ) {
              renderAnimation(element);
            }
          }
        };

        const onDBLClick = (event: LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(event);
        };

        const onMouseOver = () => {
          for (const associatedPoint of point.associatedPoints()) {
            const element = linkMap.get(associatedPoint.idPoint)?.getElement();
            const { nature } = associatedPoint;
            const className =
              nature === NatureEnum.ramassage
                ? "circle-animation-ramassage"
                : "circle-animation-etablissement";
            if (element) {
              element.classList.add(className);
            }
          }
        };

        const onMouseOut = () => {
          for (const associatedPoint of point.associatedPoints()) {
            const element = linkMap.get(associatedPoint.idPoint)?.getElement();
            const { nature } = associatedPoint;
            const className =
              nature === NatureEnum.ramassage
                ? "circle-animation-ramassage"
                : "circle-animation-etablissement";

            if (element) {
              element.classList.remove(className);
            }
          }
        };

        return (
          <Point
            borderColor="green"
            fillColor="white"
            isLast={i() === points().length - 1}
            idPoint={point.id}
            lat={point.lat}
            lon={point.lon}
            map={getLeafletMap()}
            onClick={onClick}
            onDBLClick={onDBLClick}
            onMouseOut={onMouseOut}
            onMouseOver={onMouseOver}
            radius={4}
            weight={2}
            onIsLast={() => ""}
            isBlinking={false}
          />
        );
      }}
    </For>
  );
}

function fetchEleveVersEtablissement() {
  authenticateWrap((headers) => {
    fetch(
      import.meta.env.VITE_BACK_URL +
        "/map/" +
        getActiveMapId() +
        "/eleve_vers_etablissement",
      {
        headers,
      }
    ).then(async (res) => {
      const json = await res.json();

      const data: EleveVersEtablissementType[] = json.content;

      for (const point of points()) {
        const associatedPoints = data.filter(
          (elt) =>
            point.id ===
            (point.nature === NatureEnum.ramassage
              ? elt.ramassage_id
              : elt.etablissement_id)
        );

        point.setAssociatedPoints(
          associatedPoints.map((elt) => {
            const associatedId =
              point.nature === NatureEnum.ramassage
                ? elt.etablissement_id
                : elt.ramassage_id;
            const associatedNature =
              point.nature === NatureEnum.ramassage
                ? NatureEnum.etablissement
                : NatureEnum.ramassage;
            const id_point =
              associatedNature === NatureEnum.etablissement
                ? elt.etablissement_id_point
                : elt.ramassage_id_point;

            return {
              id: associatedId,
              idPoint: id_point,
              nature: associatedNature,
            };
          })
        );
      }
    });
  });
}
