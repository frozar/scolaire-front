import { Match, Switch, createSignal, onMount } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { getBusLines } from "../../../map/component/organism/BusLines";
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

  function getSchoolLines() {
    const lines = [];

    for (const line of getBusLines()) {
      const _line = line.schools.filter((l) => l.id == schoolDetailsItem()?.id);
      if (_line.length > 0) lines.push(line);
    }

    return lines;
  }
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
            <LineList lines={getSchoolLines()} />
          </Match>
        </Switch>
      </div>
    </section>
  );
}
