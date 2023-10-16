import { For } from "solid-js";
import { AssociatedPointType } from "../../../../../_entities/_utils.entity";
import SchoolItem from "../molecul/StudentSchoolClassItem";

export default function (props: { schools: AssociatedPointType[] }) {
  return (
    <For each={props.schools}>{(school) => <SchoolItem school={school} />}</For>
  );
}
