import { For } from "solid-js";
import { AssociatedSchoolType } from "../../../../../_entities/_utils.entity";
import StudentSchoolGradeItem from "../molecul/StudentSchoolGradeItem";

export default function (props: { associatedSchools: AssociatedSchoolType[] }) {
  console.log("associatedSchool => ", props.associatedSchools);
  // ! Trier par schoolId
  const associatedSchools: { [id: number]: AssociatedSchoolType[] } = {};
  const schoolIds: number[] = []; // ! use associatedSchools keys instead ?
  // ! Rewrite
  props.associatedSchools.forEach((assoc) => {
    if (schoolIds.includes(assoc.schoolId)) {
      associatedSchools[assoc.schoolId].push(assoc);
    } else {
      schoolIds.push(assoc.schoolId);
      associatedSchools[assoc.schoolId] = [assoc];
    }
  });
  console.log("associatedSchools", associatedSchools);
  console.log("schoolIds", schoolIds);

  // return (
  //   <For each={props.associatedSchools}>
  //     {(school) => <StudentSchoolGradeItem school={school} />}
  //   </For>
  // );
  // ! Use collapsible element !
  return (
    <For each={props.associatedSchools}>
      {(school) => <StudentSchoolGradeItem school={school} />}
    </For>
  );
}
