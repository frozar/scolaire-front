import { Match, Switch, createSignal, onMount } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { changeBoard } from "../../../board/component/template/ContextManager";
import SchoolDetailsHeader from "../molecule/SchoolDetailsHeader";
import SchoolDetailsPanelsButton from "../molecule/SchoolDetailsPanelsButton";
import ClassesList from "./ClassesList";

export const [schoolDetailsItem, setSchoolDetailsItem] =
  createSignal<SchoolType>();

export enum Panels {
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
        <SchoolDetailsPanelsButton setOnPanel={setOnPanel} />

        <Switch>
          <Match when={onPanel() == Panels.classes}>
            <ClassesList />
          </Match>
          <Match when={onPanel() == Panels.lines}>lines</Match>
        </Switch>
      </div>
    </section>
  );
}
