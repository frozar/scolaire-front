import { Match, Switch, createSignal, onMount } from "solid-js";
import {
  ClasseType,
  SchoolEntity,
  SchoolType,
} from "../../../../../_entities/school.entity";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
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
      MapElementUtils.deselectAllPointsAndBusLines();
    }
  });

  return (
    <section>
      <SchoolDetailsHeader school={schoolDetailsItem() as SchoolType} />
      <SchoolDetailsPanelsButton
        setOnPanel={setOnPanel}
        onPanel={onPanel}
        NbLines={
          SchoolEntity.getSchoolLines(schoolDetailsItem()?.id as number).length
        }
      />
      <div class="content mt-5">
        <Switch>
          <Match when={onPanel() == Panels.classes}>
            <ClasseList
              classes={schoolDetailsItem()?.classes as ClasseType[]}
            />
          </Match>
          <Match when={onPanel() == Panels.lines}>
            <LineList
              lines={SchoolEntity.getSchoolLines(
                schoolDetailsItem()?.id as number
              )}
            />
          </Match>
        </Switch>
      </div>
    </section>
  );
}
