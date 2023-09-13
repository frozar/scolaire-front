import { For, createSignal, onMount } from "solid-js";
import LineItem from "../molecule/LineItem";
import "./ClassesList.css";

export interface ClasseItemProps {
  lineName: string;
  linkedSchools: string[];
  linkedStops: number;
  color: string;
  NbStopDeserved: number;
}

export default function () {
  const [classes, setClasses] = createSignal<ClasseItemProps[]>([]);

  function getSchoolClasses() {
    // TODO will load data
    // const response = Api.get('...')
    setClasses([
      {
        lineName: "line 1",
        linkedSchools: ["School 1", "School 2"],
        linkedStops: 3,
        color: "red",
        NbStopDeserved: 6,
      },
    ]);
  }

  onMount(() => {
    getSchoolClasses();
  });

  return (
    <div class="school-details-classe-list">
      <For each={classes()}>{(item) => <LineItem line={item} />}</For>
    </div>
  );
}
