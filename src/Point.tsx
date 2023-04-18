import L, { LeafletMouseEvent } from "leaflet";
import {
  createSignal,
  onMount,
  onCleanup,
  Setter,
  createEffect,
  on,
} from "solid-js";
import {
  EleveVersEtablissementType,
  NatureEnum,
  PointIdentity,
  PointRamassageType,
  PointEtablissementType,
  ModeEnum,
} from "./type";

import { useStateAction } from "./StateAction";
import { renderAnimation } from "./animation";
import { linkMap } from "./global/linkPointIdentityCircle";
import { getLeafletMap } from "./global/leafletMap";
import { fetchBusLines, setSelectedElement } from "./signaux";
import { minMaxQty } from "./PointsRamassageAndEtablissement";
const [
  ,
  {
    addPointToLineUnderConstruction,
    getLineUnderConstruction,
    setLineUnderConstructionId,
    getMode,
    isInAddLineMode,
  },
] = useStateAction();

const minSizeValue = 30;
const maxSizeValue = 75;
const range = maxSizeValue - minSizeValue;
export default function Point(props: any) {
  const point = props.point;

  const [associatedPoints, setAssociatedPoints] = createSignal<PointIdentity[]>(
    []
  );

  // For an etablissement, fetch every ramassage points which
  // contain student toward etablissement.
  // For a ramassage, fetch every etablissement points toward which
  // some student goes from this ramassage point.
  function fetchAssociatedPoints(
    point: PointEtablissementType | PointRamassageType,
    setter: Setter<PointIdentity[]>
  ) {
    const { id, nature } = point;

    const [getEndPoint, getParameter] =
      nature === NatureEnum.ramassage
        ? ["eleves_vers_etablissement_by_ramassage", "id_ramassage"]
        : nature === NatureEnum.etablissement
        ? ["eleves_vers_etablissement_by_etablissement", "id_etablissement"]
        : [null, null];

    if (getEndPoint && getParameter) {
      fetch(
        import.meta.env.VITE_BACK_URL +
          "/" +
          getEndPoint +
          "?" +
          getParameter +
          "=" +
          id
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
                id_point: id_point,
                nature: associatedNature,
              };
            })
          );
        });
    }
  }

  let circle: L.Circle<any>;

  function buildCircle(point: PointEtablissementType): L.Circle<any> {
    const location = point.location;
    const lonlat = location.split("(")[1].split(")")[0];
    const lon = Number(lonlat.split(" ")[0]);
    const lat = Number(lonlat.split(" ")[1]);
    const radiusValue =
      ((point.quantity - minMaxQty()[0]) / (minMaxQty()[1] - minMaxQty()[0])) *
        range +
      minSizeValue;
    const { nature } = point;
    const [color, fillColor, radius, weight] =
      nature === NatureEnum.ramassage
        ? ["red", "white", radiusValue, 2]
        : nature === NatureEnum.etablissement
        ? ["green", "white", 100, 4]
        : ["white", "#000", 150, 4];
    return L.circle([lat, lon], {
      color,
      fillColor,
      radius,
      fillOpacity: 1,
      weight,
    })
      .on("click", () => {
        // Select the current element to display information
        setSelectedElement(point);
        if (!isInAddLineMode()) {
          return;
        }

        const pointIdentity: PointIdentity = {
          id: point.id,
          id_point: point.id_point,
          nature: point.nature,
        };
        addPointToLineUnderConstruction(pointIdentity);
        if (!(1 < getLineUnderConstruction().stops.length)) {
          return;
        }

        let data = {
          id_bus_line: getLineUnderConstruction().id_bus_line,
          ids_point: getLineUnderConstruction().stops.map(function (value) {
            return value["id_point"];
          }),
        };

        fetch(import.meta.env.VITE_BACK_URL + "/bus_line", {
          method: "POST",
          body: JSON.stringify(data),
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            const { id } = res;
            setLineUnderConstructionId(id);
            fetchBusLines();
          });

        // Highlight point ramassage
        for (const associatedPoint of associatedPoints()) {
          let element;
          if ((element = linkMap.get(associatedPoint.id_point)?.getElement())) {
            renderAnimation(element);
          }
        }
      })
      .on("dblclick", (event: LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(event);
      })
      .on("mouseover", () => {
        for (const associatedPoint of associatedPoints()) {
          const element = linkMap.get(associatedPoint.id_point)?.getElement();
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
      .on("mouseout", () => {
        for (const associatedPoint of associatedPoints()) {
          const element = linkMap.get(associatedPoint.id_point)?.getElement();
          const { nature } = associatedPoint;
          const className =
            nature === NatureEnum.ramassage
              ? "circle-animation-ramassage"
              : "circle-animation-etablissement";

          if (element) {
            element.classList.remove(className);
          }
        }
      });
  }

  // If a line is under construction, show a pencil when the mouse is over a circle
  createEffect(
    on(getMode, (mode) => {
      if (circle) {
        const element = circle.getElement() as SVGElement;
        if (element) {
          if (mode === ModeEnum.addLine) {
            if (String(element.style) !== "cursor: url('/pencil.png'), auto;") {
              // @ts-expect-error
              element.style = "cursor: url('/pencil.png'), auto;";
            }
          } else {
            if (String(element.style) !== "") {
              // @ts-expect-error
              element.style = "";
            }
          }
        }
      }
    })
  );

  onMount(() => {
    circle = buildCircle(point);
    circle.addTo(getLeafletMap());

    const element = circle.getElement();
    if (element) {
      linkMap.set(point.id_point, circle);
    }

    // Fetch associated points (ramassage or etablissement) and
    // store them in the associatedPoints() signal (used is the on'click' event)
    fetchAssociatedPoints(point, setAssociatedPoints);
  });

  onCleanup(() => {
    linkMap.delete(point.id_point);

    circle.remove();
  });

  return <></>;
}
