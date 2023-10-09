import { For } from "solid-js";
import { ClasseType } from "../../../../../_entities/classe.entity";
import ClasseItem from "../molecule/ClasseItem";

export default function (props: { classes: ClasseType[] }) {
  return (
    <div class="school-details-classe-list">
      <For each={props.classes}>
        {(item) => <ClasseItem NbStudents={0} nameClass={item.name} />}
      </For>
    </div>
  );
}
