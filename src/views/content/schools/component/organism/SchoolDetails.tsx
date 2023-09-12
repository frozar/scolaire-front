import { Match, Switch, createSignal, onMount } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { changeBoard } from "../../../board/component/template/ContextManager";
import SchoolDetailsHeader from "../molecule/SchoolDetailsHeader";

export const [schoolDetailsItem, setSchoolDetailsItem] =
  createSignal<SchoolType>();

enum Panels {
  classes = "classes",
  lines = "lines",
}

export default function () {
  const [onPanel, setOnPanel] = createSignal<Panels>(Panels.classes);

  onMount(() => {
    if (schoolDetailsItem() == undefined) {
      changeBoard("schools");
    }
  });

  return (
    <section>
      <SchoolDetailsHeader />

      <div class="content mt-2">
        <div class="labels flex gap-2 text-xs text-white">
          <button
            class="px-4 py-2 bg-green-base flex justify-center rounded-2xl"
            onClick={() => setOnPanel(Panels.classes)}
          >
            classes
          </button>
          <button
            class="px-4 py-2 bg-green-base flex justify-center rounded-2xl"
            onClick={() => setOnPanel(Panels.lines)}
          >
            lignes: Todo
          </button>
        </div>

        <Switch>
          <Match when={onPanel() == Panels.classes}>classes</Match>
          <Match when={onPanel() == Panels.lines}>lines</Match>
        </Switch>
      </div>
    </section>
  );
}
