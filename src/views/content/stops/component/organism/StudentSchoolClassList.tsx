import { For } from "solid-js";
import { ClassToSchoolTypeFormatedWithUsedQuantity } from "../../../../../_entities/student-to-school.entity";
import SchoolItem from "../molecul/StudentSchoolClassItem";

export default function (props: {
  schools: ClassToSchoolTypeFormatedWithUsedQuantity[];
}) {
  return (
    <For each={props.schools}>{(school) => <SchoolItem school={school} />}</For>
  );
}
