import { Match, Switch, createSignal, onMount } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { changeBoard } from "../../../board/component/template/ContextManager";
import SchoolDetailsHeader from "../molecule/SchoolDetailsHeader";
import SchoolDetailsPanelsButton from "../molecule/SchoolDetailsPanelsButton";
import ClasseList from "./ClasseList";
import LineList from "./LinesList";

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
        <SchoolDetailsPanelsButton setOnPanel={setOnPanel} onPanel={onPanel} />

        <Switch>
          <Match when={onPanel() == Panels.classes}>
            <ClasseList />
          </Match>
          <Match when={onPanel() == Panels.lines}>
            <LineList />
          </Match>
        </Switch>
      </div>
    </section>
  );
}
