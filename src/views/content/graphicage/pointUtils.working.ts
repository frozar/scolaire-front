// import L, { LeafletMouseEvent } from "leaflet";
// import { useStateAction } from "../../../StateAction";
// import { points } from "../../../signaux";
// import {
//   NatureEnum,
//   PointEtablissementType,
//   PointIdentityType,
// } from "../../../type";
// import { renderAnimation } from "./animation";
// import { deselectAllBusLines } from "./line/busLinesUtils";

// const [
//   ,
//   {
//     addPointToLineUnderConstruction,
//     getLineUnderConstruction,
//     isInAddLineMode,
//   },
// ] = useStateAction();

// export const linkMap = new Map<number, L.CircleMarker>();

// export function selectPointById(targerIdPoint: number) {
//   points().map((point) => point.setSelected(targerIdPoint == point.idPoint));
// }

// export function deselectAllPoints() {
//   points().map((point) => point.setSelected(false));
// }

// /**
//  * Here we defined the size of the point according to number of people on the stop
//  * @param minQuantity minimun student on stop
//  * @param maxQuantity maximun student on stop
//  */
// export function definePointRadius(
//   minQuantity: number,
//   maxQuantity: number,
//   point: PointEtablissementType
// ) {
//   const minSizeValue = 5;
//   const maxSizeValue = 10;
//   const range = maxSizeValue - minSizeValue;

//   const coef =
//     minQuantity == maxQuantity
//       ? 0
//       : (point.quantity - minQuantity) / (maxQuantity - minQuantity);

//   const radiusValue = coef * range + minSizeValue;

//   return radiusValue;
// }

// export const buildCircleEvent = {
//   onClick: (point: PointEtablissementType) => {
//     if (!isInAddLineMode()) {
//       deselectAllBusLines();
//       selectPointById(point.idPoint);
//       return;
//     }

//     const pointIdentity: PointIdentityType = {
//       id: point.id,
//       idPoint: point.idPoint,
//       nature: point.nature,
//     };

//     addPointToLineUnderConstruction(pointIdentity);

//     if (!(1 < getLineUnderConstruction().stops.length)) {
//       return;
//     }

//     // Highlight point ramassage
//     for (const associatedPoint of point.associatedPoints()) {
//       let element;
//       if ((element = linkMap.get(associatedPoint.idPoint)?.getElement())) {
//         renderAnimation(element);
//       }
//     }
//   },

//   onDBLClick: (event: LeafletMouseEvent) => L.DomEvent.stopPropagation(event),

//   mouseOver: (point: PointEtablissementType) => {
//     for (const associatedPoint of point.associatedPoints()) {
//       const element = linkMap.get(associatedPoint.idPoint)?.getElement();
//       const { nature } = associatedPoint;
//       const className =
//         nature === NatureEnum.ramassage
//           ? "circle-animation-ramassage"
//           : "circle-animation-etablissement";
//       if (element) {
//         element.classList.add(className);
//       }
//     }
//   },

//   mouseOut: (point: PointEtablissementType) => {
//     for (const associatedPoint of point.associatedPoints()) {
//       const element = linkMap.get(associatedPoint.idPoint)?.getElement();
//       const { nature } = associatedPoint;
//       const className =
//         nature === NatureEnum.ramassage
//           ? "circle-animation-ramassage"
//           : "circle-animation-etablissement";

//       if (element) {
//         element.classList.remove(className);
//       }
//     }
//   },
// };

// // export function newFunction(nature: string): [string, string, number, number] {
// //   return nature === NatureEnum.ramassage
// //     ? ["red", "white", radiusValue, 2]
// //     : nature === NatureEnum.etablissement
// //     ? ["green", "white", 12, 4]
// //     : ["white", "#000", 18, 4];
// // }
