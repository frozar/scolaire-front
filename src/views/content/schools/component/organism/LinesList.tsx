import { For, createSignal, onMount } from "solid-js";
import LineItem from "../molecule/LineItem";
import "./LinesList.css";

export interface LineItemProps {
  lineName: string;
  linkedSchools: string[];
  linkedStops: number;
  color: string;
  NbStopDeserved: number;
}

export default function () {
  const [lines, setLines] = createSignal<LineItemProps[]>([]);

  function getSchoolClasses() {
    // TODO will load data
    // const response = Api.get('...')
    setLines([
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
      <For each={lines()}>{(item) => <LineItem line={item} />}</For>
    </div>
  );
}
