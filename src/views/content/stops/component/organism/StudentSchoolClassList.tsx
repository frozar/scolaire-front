import { For } from "solid-js";
import { AssociatedPointType } from "../../../../../_entities/_utils.entity";
import SchoolItem from "../molecul/StudentSchoolClassItem";

export default function (props: {
  schools: AssociatedPointType[];
  removeClassStudentToSchoolItem: (id: number) => void;
}) {
  return (
    <For each={props.schools}>
      {(school) => (
        <SchoolItem
          school={school}
          removeClassStudentToSchoolItem={props.removeClassStudentToSchoolItem}
        />
      )}
    </For>
  );
}
