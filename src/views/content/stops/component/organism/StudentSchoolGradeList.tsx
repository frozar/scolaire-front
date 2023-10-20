import { For } from "solid-js";
import { AssociatedSchoolType } from "../../../../../_entities/_utils.entity";
import SchoolItem from "../molecul/StudentSchoolClassItem";

export default function (props: { schools: AssociatedSchoolType[] }) {
  return (
    <For each={props.schools}>{(school) => <SchoolItem school={school} />}</For>
  );
}
