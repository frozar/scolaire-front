import { Match, Show, Switch, createSignal } from "solid-js";
import { HoursType } from "../../../../../_entities/_utils.entity";
import { GradeType } from "../../../../../_entities/grade.entity";
import { SchoolEntity } from "../../../../../_entities/school.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import SchoolDetailsPanelsButton from "../molecule/SchoolDetailsPanelsButton";
import { setSelectedGrade } from "./GradeEditBoard";
import GradeList from "./GradeList";
import { schoolDetailsItem } from "./SchoolDetails";
import { TripsList } from "./TripsList";

import { SchoolUtils } from "../../../../../utils/school.utils";
import "./SchoolDetailsPanels.css";

export enum PanelsEnum {
  grades = "grades",
  lines = "lines",
}

export function SchoolDetailsPanels() {
  const [onPanel, setOnPanel] = createSignal<PanelsEnum>(PanelsEnum.grades);

  function onClickAddGrade() {
    const grade: GradeType = {
      name: "Nom par défaut",
      hours: schoolDetailsItem()?.hours as HoursType,
      calendar: schoolDetailsItem()?.calendar,
    };

    setSelectedGrade(grade);
    changeBoard("school-grade-add");
  }

  return (
    <>
      <div class="panel-actions">
        <SchoolDetailsPanelsButton
          setOnPanel={setOnPanel}
          onPanel={onPanel}
          NbTrips={
            SchoolEntity.getSchoolTrips(schoolDetailsItem()?.id as number)
              .length
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
              grades={
                SchoolUtils.getGrades(schoolDetailsItem()?.id) as GradeType[]
              }
            />
          </Match>
          <Match when={onPanel() == PanelsEnum.lines}>
            <TripsList
              trips={SchoolEntity.getSchoolTrips(
                schoolDetailsItem()?.id as number
              )}
            />
          </Match>
        </Switch>
      </div>
    </>
  );
}
