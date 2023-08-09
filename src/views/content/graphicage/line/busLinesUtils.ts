import L from "leaflet";
import { linkMap } from "../component/organism/Points";
import { LeafletSchoolType } from "../component/organism/SchoolPoints";
import { LeafletStopType } from "../component/organism/StopPoints";

// TODO to move or delete
export function getLatLngs(
  stops: (LeafletStopType | LeafletSchoolType)[]
): L.LatLng[] {
  const latlngs: L.LatLng[] = [];

  // TODO: linkMap must be reactive => signal

  for (const pointIdentity of stops) {
    const circle = linkMap.get(pointIdentity.leafletId);
    if (circle) {
      latlngs.push(circle.getLatLng());
    }
  }

  return latlngs;
}

// TODO still used ---- to move
export function arrowApplyStyle(
  arrows: L.Marker[],
  color: string,
  transform: string
) {
  // Change color
  arrows.map((arrow) => {
    const element = arrow.getElement();
    if (!element) {
      return;
    }
    const elementChild = element.firstElementChild;
    if (!elementChild) {
      return;
    }
    elementChild.setAttribute("fill", color);
  });

  // Change size
  arrows.map((arrow) => {
    const element = arrow.getElement();
    if (!element) {
      return;
    }

    const elementChild = element.firstElementChild;
    if (!elementChild) {
      return;
    }

    const subChild = elementChild.firstElementChild;
    if (!subChild) {
      return;
    }

    // Keep first transformation value which should be a rotation
    const transformValue = subChild.getAttribute("transform");
    const rotation = transformValue;
    if (!rotation) {
      return;
    }

    const rotationValue = rotation.split(" ").at(1);
    const transformModifiedValue = transform + rotationValue;

    subChild.setAttribute("transform", transformModifiedValue);
  });
}

// TODO still used ---- to move
function polylineSetBoldStyle(polyline: L.Polyline, color: string) {
  polyline.setStyle({ color, weight: 8 });
}

// TODO still used ---- to move
function polylineSetNormalStyle(polyline: L.Polyline, color: string) {
  polyline.setStyle({ color, weight: 3 });
}

// TODO still used ---- to move
function arrowsSetBoldStyle(arrows: L.Marker[], color: string) {
  arrowApplyStyle(arrows, color, "scale(4,4) ");
}

// TODO still used ---- to move
function arrowsSetNormalStyle(arrows: L.Marker[], color: string) {
  arrowApplyStyle(arrows, color, "scale(2,2) ");
}

// TODO still used ---- to move
export function buslineSetBoldStyle(
  polyline: L.Polyline,
  arrowsLinked: L.Marker[],
  color: string
) {
  polylineSetBoldStyle(polyline, color);
  arrowsSetBoldStyle(arrowsLinked, color);
}

// TODO still used ---- to move
export function buslineSetNormalStyle(
  polyline: L.Polyline,
  arrowsLinked: L.Marker[],
  color: string
) {
  polylineSetNormalStyle(polyline, color);
  arrowsSetNormalStyle(arrowsLinked, color);
}

// TODO utilité ? Résultat ? --- to delete or re-use
// function computeArrowsInNotReadMode(latLngs: L.LatLng[], color: string) {
//   const increment = 1;
//   const iStart = 0;

//   const arrows: L.Marker[] = [];

//   for (let i = iStart; i < latLngs.length - 1; i = i + increment) {
//     // straight routes
//     const latArrow = (latLngs[i + 1].lat - latLngs[i].lat) / 2 + latLngs[i].lat;
//     const lngArrow = (latLngs[i + 1].lng - latLngs[i].lng) / 2 + latLngs[i].lng;
//     const diffX = latLngs[i + 1].lng - latLngs[i].lng;
//     const diffY = latLngs[i + 1].lat - latLngs[i].lat;

//     const arrowAngle = (Math.atan2(diffX, diffY) * 180) / Math.PI + 180;
//     const arrowIcon = L.divIcon({
//       className: "",
//       html: getArrowSVG(color, arrowAngle),
//     });

//     // arrow creation
//     const arrow = new L.Marker([latArrow, lngArrow], {
//       icon: arrowIcon,
//       pane: "overlayPane",
//     });

//     arrows.push(arrow);
//   }

//   return arrows;
// }
