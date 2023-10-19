import { Match, Show, Switch, createSignal, onMount } from "solid-js";
import { ClasseType } from "../../../../../_entities/classe.entity";
import {
  SchoolEntity,
  SchoolType,
} from "../../../../../_entities/school.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import SchoolDetailsHeader from "../molecule/SchoolDetailsHeader";
import SchoolDetailsPanelsButton from "../molecule/SchoolDetailsPanelsButton";
import ClasseList from "./ClasseList";
import "./SchoolDetails.css";
import { TripsList } from "./TripsList";

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
      MapElementUtils.deselectAllPointsAndBusTrips();
    }
  });

  function onClickAddClasse() {
    changeBoard("school-class-add");
  }

  return (
    <section>
      <SchoolDetailsHeader school={schoolDetailsItem() as SchoolType} />

      <div class="panel-actions">
        <SchoolDetailsPanelsButton
          setOnPanel={setOnPanel}
          onPanel={onPanel}
          NbTrips={
            SchoolEntity.getSchoolTrips(schoolDetailsItem()?.id as number)
              .length
          }
        />
        <Show when={onPanel() == Panels.classes}>
          <ButtonIcon icon={<PlusIcon />} onClick={onClickAddClasse} />
        </Show>
      </div>
      <div class="board-content">
        <Switch>
          <Match when={onPanel() == Panels.classes}>
            <ClasseList
              classes={schoolDetailsItem()?.classes as ClasseType[]}
            />
          </Match>
          <Match when={onPanel() == Panels.lines}>
            <TripsList
              trips={SchoolEntity.getSchoolTrips(
                schoolDetailsItem()?.id as number
              )}
            />
          </Match>
        </Switch>
      </div>
    </section>
  );
}
