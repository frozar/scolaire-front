import L from "leaflet";
import { Accessor, Setter, createSignal, mergeProps } from "solid-js";
import { useStateGui } from "../../../../../StateGui";
import { getLeafletMap } from "../../../../../signaux";
import { EleveVersEtablissementType } from "../../../../../type";
import { PointIdentityType, PointInterface } from "../atom/Point";
import PointsEtablissement from "./PointsEtablissement";
import PointsRamassage from "./PointsRamassage";

const [, { getActiveMapId }] = useStateGui();

export const [blinkingPoints, setBlinkingPoint] = createSignal<number[]>([]);
export const setBlinking = (
  associatedPoints: Accessor<PointIdentityType[]>
) => {
  const toBlink: number[] = [];
  for (const associatedPoint of associatedPoints()) {
    toBlink.push(associatedPoint.idPoint);
  }
  setBlinkingPoint(toBlink);
};

// This will be removed in the future with the innerJoin or LeftJoin
export const [studentsToSchool, setStudentsToSchool] = createSignal<
  EleveVersEtablissementType[]
>([]);

// const setupAssociation = (
//   points: PointInterface[],
//   nature: "school" | "stop"
// ) => {
//   const newPoints = [];
//   for (const point of points) {
//     const associated = studentsToSchool().filter(
//       (elt) =>
//         point.id ===
//         (nature === "stop" ? elt.ramassage_id : elt.etablissement_id)
//     );

//     point.setAssociatedPoints(
//       associated.map((elt) => {
//         return {
//           id: elt.etablissement_id,
//           idPoint: elt.ramassage_id_point,
//         };
//       })
//     );
//     newPoints.push(point);
//     console.log("set association");
//     console.log("point associated: ", point.associatedPoints());
//   }

//   return newPoints;
// };

// Props here is for storybook
interface PointsProps {
  map?: L.Map;
  mapId?: number;
  schoolItems?: {
    items: Accessor<PointInterface[]>;
    set: Setter<PointInterface[]>;
  };
  stopItems?: {
    items: Accessor<PointInterface[]>;
    set: Setter<PointInterface[]>;
  };
  studentsToSchool?: {
    items: Accessor<EleveVersEtablissementType[]>;
    set: Setter<EleveVersEtablissementType[]>;
  };
}

export default function (props: PointsProps) {
  const mergedProps = mergeProps(
    {
      map: getLeafletMap() as L.Map,
      mapId: getActiveMapId() as number,
    },
    props
  );

  // const schoolItems: PointInterface[] = [];
  // const stopsItem: PointInterface[] = [];

  // console.log(props.stopItems?.items());

  // if (props.studentsToSchool) {
  //   studentsToSchool = props.studentsToSchool;
  // }

  // if (props.schoolsItem && props.stopsItem) {
  //   schoolItems = setupAssociation(
  //     props.schoolsItem as PointInterface[],
  //     "school"
  //   );
  //   stopsItem = setupAssociation(props.stopsItem as PointInterface[], "stop");
  // }

  // // onMount(async () => {});

  // createEffect(() => {
  //   if (!props.studentsToSchool) {
  //     studentsToSchool = await fetchEleveVersEtablissement(
  //       getActiveMapId() as number
  //     );
  //   } else {
  //     studentsToSchool = props.studentsToSchool;
  //   }

  //   setStudentsToSchool(studentsToSchool);
  //   console.log("mergedProps", mergedProps, studentsToSchool);
  //   if (!props.schoolsItem) {
  //     console.log("school is not defined in props");

  //     createEffect(() => {
  //       setupAssociation(etablissements(), "school");
  //       setupAssociation(ramassages(), "stop");
  //     });
  //   } else {
  //     console.log("school is defined in props");

  //     schoolItems = setupAssociation(
  //       props.schoolsItem as PointInterface[],
  //       "school"
  //     );
  //     stopsItem = setupAssociation(props.stopsItem as PointInterface[], "stop");

  //     console.log("stops: ", stopsItem[0].associatedPoints());
  //   }
  // });

  return (
    <div>
      <PointsEtablissement
        {...mergedProps}
        items={props.schoolItems?.items()}
      />
      <PointsRamassage {...mergedProps} items={props.stopItems?.items()} />
    </div>
  );
}

// ---------------
