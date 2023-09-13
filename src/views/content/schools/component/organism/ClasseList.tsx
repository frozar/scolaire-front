import { For, createSignal, onMount } from "solid-js";
import ClasseItem from "../molecule/ClasseItem";

interface ClasseItemProps {
  classeName: string;
  NbStudents: number;
}

export default function () {
  const [classes, setClasses] = createSignal<ClasseItemProps[]>([]);

  onMount(() => {
    setClasses([{ classeName: "Classe name", NbStudents: 1 }]);
  });

  return (
    <div class="school-details-classe-list">
      <For each={classes()}>
        {(item) => (
          <ClasseItem NbStudents={item.NbStudents} classe={item.classeName} />
        )}
      </For>
    </div>
  );
}
