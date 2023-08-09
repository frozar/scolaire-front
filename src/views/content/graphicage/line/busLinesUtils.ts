import L from "leaflet";
import { linkMap } from "../component/organism/Points";
import { LeafletSchoolType } from "../component/organism/SchoolPoints";
import { LeafletStopType } from "../component/organism/StopPoints";



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
