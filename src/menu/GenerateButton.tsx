// import { openExportConfirmationBox } from "../signaux";

import _ from "lodash";
import { addNewUserInformation, busLines, points } from "../signaux";
import {
  LineType,
  MessageLevelEnum,
  MessageTypeEnum,
  PointIdentityType,
  PointRamassageType,
} from "../type";

// Set.difference = function (s1: Set, s2: Set) {
//   if (!s1 instanceof Set || !s2 instanceof Set) {
//     console.log("The given objects are not of type Set");
//     return null;
//   }
//   const newSet = new Set();
//   s1.forEach((elem) => newSet.add(elem));
//   s2.forEach((elem) => newSet.delete(elem));
//   return newSet;
// };

// function getDifference<T>(setA: Set<T>, setB: Set<T>) {
//   return new Set(
//     [...setA].filter((element) => {
//       console.log("element", element);
//       console.log("setB", setB);
//       console.log("setB.has(element)", setB.has(element));
//       return !setB.has(element);
//     })
//   );
// }

function compute_unplanned_stops(
  all_pois: PointIdentityType[],
  planned_stops: PointIdentityType[]
) {
  // const all_pois = points().map(
  //   (elt: PointRamassageType): PointIdentityType => {
  //     const { id, id_point, nature } = elt;
  //     return { id, id_point, nature };
  //   }
  // );

  // const planned_stops: PointIdentityType[] = _.flattenDeep(
  //   busLines().map((elt: LineType) => elt.stops)
  // );
  console.log("planned_stops", planned_stops);
  return _.differenceWith(all_pois, planned_stops, _.isEqual);
}

export default function () {
  const onClickHandler = () => {
    // const unplanned_stops = compute_unplanned_stops();

    const all_pois = points().map(
      (elt: PointRamassageType): PointIdentityType => {
        const { id, id_point, nature } = elt;
        return { id, id_point, nature };
      }
    );

    const planned_stops: PointIdentityType[] = _.flattenDeep(
      busLines().map((elt: LineType) => elt.stops)
    );

    const unplanned_stops = compute_unplanned_stops(all_pois, planned_stops);

    console.log("unplanned_stops", unplanned_stops);
    if (unplanned_stops.length == 0) {
      addNewUserInformation({
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
        content: "Aucun Point d'Intéret libre pour la génération de lignes.",
      });
    }
  };

  return (
    <>
      <div class="generate-btn">
        <button onClick={onClickHandler}>Generate</button>
      </div>
    </>
  );
}
