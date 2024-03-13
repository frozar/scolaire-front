import { Match, Show, Switch, createSignal } from "solid-js";
import { GradeType } from "../../../../../_entities/grade.entity";
import {
  SchoolEntity,
  SchoolType,
} from "../../../../../_entities/school.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import SchoolDetailsPanelsButton from "../molecule/SchoolDetailsPanelsButton";
import GradeList from "./GradeList";
import { TripsList } from "./TripsList";

import { SchoolUtils } from "../../../../../utils/school.utils";
import { ViewManager } from "../../../ViewManager";
import { schoolDetails } from "../template/SchoolDetails";
import "./SchoolDetailsPanels.css";

export enum PanelsEnum {
  grades = "grades",
  lines = "lines",
}

export function SchoolDetailsPanels() {
  const [onPanel, setOnPanel] = createSignal<PanelsEnum>(PanelsEnum.grades);

  function onClickAddGrade() {
    ViewManager.schoolGradeAdd(schoolDetails() as SchoolType);
  }

  return (
    <>
      <div class="panel-actions">
        <SchoolDetailsPanelsButton
          setOnPanel={setOnPanel}
          onPanel={onPanel}
          NbTrips={
            SchoolEntity.getSchoolTrips(schoolDetails()?.id as number).length
          }
        />
        <Show when={onPanel() == PanelsEnum.grades}>
          <ButtonIcon icon={<PlusIcon />} onClick={onClickAddGrade} />
        </Show>
      </div>

      <div class="board-content">
        <Switch>
          <Match when={onPanel() == PanelsEnum.grades}>
            <GradeList
              grades={SchoolUtils.getGrades(schoolDetails()?.id) as GradeType[]}
            />
          </Match>
          <Match when={onPanel() == PanelsEnum.lines}>
            <TripsList
              trips={SchoolEntity.getSchoolTrips(schoolDetails()?.id as number)}
            />
          </Match>
        </Switch>
      </div>
    </>
  );
}
