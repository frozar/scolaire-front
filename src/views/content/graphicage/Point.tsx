import L, { LeafletMouseEvent } from "leaflet";
import {
  Setter,
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount,
} from "solid-js";
import {
  EleveVersEtablissementType,
  NatureEnum,
  PointEtablissementType,
  PointIdentityType,
  PointRamassageType,
} from "../../../type";

import { useStateAction } from "../../../StateAction";
import {
  getLeafletMap,
  points,
  setIsEtablissementReady,
  setIsRamassageReady,
} from "../../../signaux";
import { authenticateWrap } from "../../layout/topNav/authentication";
import { renderAnimation } from "./animation";
import { deselectAllBusLines } from "./line/busLinesUtils";

export const linkMap = new Map<number, L.CircleMarker>();

const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    isInAddLineMode,
  },
] = useStateAction();

function selectPointById(targerIdPoint: number) {
  points().map((point) => point.setSelected(targerIdPoint == point.idPoint));
}

export function deselectAllPoints() {
  points().map((point) => point.setSelected(false));
}

const minSizeValue = 5;
const maxSizeValue = 10;
const range = maxSizeValue - minSizeValue;

export default function (props: {
  point: PointRamassageType | PointEtablissementType;
  isLast: boolean;
  nature: NatureEnum;
  minQuantity: number;
  maxQuantity: number;
}) {
  const point = () => props.point;
  const isLast = () => props.isLast;
  const nature = () => props.nature;
  const minQuantity = () => props.minQuantity;
  const maxQuantity = () => props.maxQuantity;

  const [associatedPoints, setAssociatedPoints] = createSignal<
    PointIdentityType[]
  >([]);

  // For an etablissement, fetch every ramassage points which
  // contain student toward etablissement.
  // For a ramassage, fetch every etablissement points toward which
  // some student goes from this ramassage point.
  function fetchAssociatedPoints(
    point: PointEtablissementType | PointRamassageType,
    setter: Setter<PointIdentityType[]>
  ) {
    const { id, nature } = point;

    const [getEndPoint, getParameter] =
      nature === NatureEnum.ramassage
        ? ["eleves_vers_etablissement_by_ramassage", "id_ramassage"]
        : nature === NatureEnum.etablissement
        ? ["eleves_vers_etablissement_by_etablissement", "id_etablissement"]
        : [null, null];

    if (getEndPoint && getParameter) {
      authenticateWrap((headers) => {
        fetch(
          import.meta.env.VITE_BACK_URL +
            "/" +
            getEndPoint +
            "?" +
            getParameter +
            "=" +
            id,
          {
            headers,
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((data: EleveVersEtablissementType[]) => {
            setter(
              data.map((elt) => {
                const associatedId =
                  nature === NatureEnum.ramassage
                    ? elt.etablissement_id
                    : elt.ramassage_id;
                const associatedNature =
                  nature === NatureEnum.ramassage
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
          });
      });
    }
  }

  let circle: L.CircleMarker;

  function buildCircle(point: PointEtablissementType): L.CircleMarker {
    const location = point.location;
    const lonlat = location.split("(")[1].split(")")[0];
    const lon = Number(lonlat.split(" ")[0]);
    const lat = Number(lonlat.split(" ")[1]);

    // console.log("location", location);
    // console.log("lonlat", lonlat);
    // console.log("lon", lon);
    // console.log("lat", lat);

    // console.log("minQuantity", minQuantity());
    // console.log("maxQuantity", maxQuantity());

    // console.log("point.quantity", point.quantity);
    // console.log("minQuantity", minQuantity());
    // console.log("maxQuantity", maxQuantity());

    const coef =
      minQuantity() == maxQuantity()
        ? 0
        : (point.quantity - minQuantity()) / (maxQuantity() - minQuantity());
    // console.log("coef", coef);

    const radiusValue = coef * range + minSizeValue;
    // console.log("radiusValue", radiusValue);

    const { nature } = point;
    // console.log("nature", nature);

    const [color, fillColor, radius, weight] =
      nature === NatureEnum.ramassage
        ? ["red", "white", radiusValue, 2]
        : nature === NatureEnum.etablissement
        ? ["green", "white", 12, 4]
        : ["white", "#000", 18, 4];
    // console.log("color", color);
    // console.log("fillColor", fillColor);
    // console.log("radius", radius);
    // console.log("weight", weight);

    return (
      L.circleMarker([lat, lon], {
        color,
        fillColor,
        radius,
        fillOpacity: 1,
        weight,
        pane: "markerPane",
      })
        // eslint-disable-next-line solid/reactivity
        .on("click", () => {
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
          for (const associatedPoint of associatedPoints()) {
            let element;
            if (
              (element = linkMap.get(associatedPoint.idPoint)?.getElement())
            ) {
              renderAnimation(element);
            }
          }
        })
        .on("dblclick", (event: LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(event);
        })
        // eslint-disable-next-line solid/reactivity
        .on("mouseover", () => {
          for (const associatedPoint of associatedPoints()) {
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
        })
        // eslint-disable-next-line solid/reactivity
        .on("mouseout", () => {
          for (const associatedPoint of associatedPoints()) {
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
        })
    );
  }

  // If a line is under construction, show a pencil when the mouse is over a circle
  createEffect(
    on(isInAddLineMode, (isInAddLineMode) => {
      if (circle) {
        const element = circle.getElement() as SVGElement;
        if (element) {
          if (isInAddLineMode) {
            if (String(element.style) !== "cursor: url('/pencil.png'), auto;") {
              // @ts-expect-error: 'style' field should not be assigned
              element.style = "cursor: url('/pencil.png'), auto;";
            }
          } else {
            if (String(element.style) !== "") {
              // @ts-expect-error: 'style' field should not be assigned
              element.style = "";
            }
          }
        }
      }
    })
  );

  onMount(() => {
    const leafletMap = getLeafletMap();
    if (!leafletMap) {
      return;
    }

    // console.log("point", point());

    circle = buildCircle(point());
    circle.addTo(leafletMap);

    const element = circle.getElement();
    if (element) {
      linkMap.set(point().idPoint, circle);
    }

    // Fetch associated points (ramassage or etablissement) and
    // store them in the associatedPoints() signal (used is the on'click' event)
    fetchAssociatedPoints(point(), setAssociatedPoints);
    if (isLast()) {
      if (nature() === NatureEnum.ramassage) {
        setIsRamassageReady(true);
      } else {
        setIsEtablissementReady(true);
      }
    }
  });

  onCleanup(() => {
    linkMap.delete(point().idPoint);
    circle.remove();
  });

  return <></>;
}
