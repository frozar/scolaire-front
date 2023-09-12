import { For, createSignal, onMount } from "solid-js";
import ClasseItem from "../molecule/ClasseItem";
import "./ClassesList.css";

export default function () {
  const [classes, setClasses] = createSignal<any[]>([]);

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
      <For each={classes()}>{(item) => <ClasseItem line={item} />}</For>
    </div>
  );
}
