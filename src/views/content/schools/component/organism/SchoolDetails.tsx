import { Match, Show, Switch, createSignal, onMount } from "solid-js";
import { GradeType } from "../../../../../_entities/grade.entity";
import {
  SchoolEntity,
  SchoolType,
} from "../../../../../_entities/school.entity";
import PlusIcon from "../../../../../icons/PlusIcon";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { SchoolUtils } from "../../../../../utils/school.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import SchoolDetailsHeader from "../molecule/SchoolDetailsHeader";
import SchoolDetailsPanelsButton from "../molecule/SchoolDetailsPanelsButton";
import GradeList from "./GradeList";
import "./SchoolDetails.css";
import { SchoolHoursSlots } from "./SchoolHoursSlots";
import { TripsList } from "./TripsList";

export const [schoolDetailsItem, setSchoolDetailsItem] =
  createSignal<SchoolType>();

export const [schoolDetailEditing, setSchoolDetailEditing] =
  createSignal<boolean>(false);

export function editSchoolDetail() {
  if (!schoolDetailEditing()) {
    setSchoolDetailEditing(true);
  } else {
    console.log(
      "diff:",
      SchoolUtils.get(schoolDetailsItem()?.id ?? 0)?.hours,
      schoolDetailsItem()?.hours
    );

    if (SchoolUtils.isValidSchool(schoolDetailsItem() as SchoolType)) {
      if (
        SchoolUtils.get(schoolDetailsItem()?.id ?? 0) != schoolDetailsItem() ||
        SchoolUtils.get(schoolDetailsItem()?.id ?? 0)?.hours !=
          schoolDetailsItem()?.hours
      ) {
        console.log("update diff");
      }
      setSchoolDetailEditing(false);
      console.log("school can be updated", schoolDetailsItem());
    }
  }
}

export enum Panels {
  grades = "grades",
  lines = "lines",
}

export default function () {
  const [onPanel, setOnPanel] = createSignal<Panels>(Panels.grades);

  onMount(() => {
    if (schoolDetailsItem() == undefined) {
      changeBoard("schools");
      MapElementUtils.deselectAllPointsAndBusTrips();
    }
  });

  function onClickAddGrade() {
    changeBoard("school-grade-add");
  }

  return (
    <section>
      <SchoolDetailsHeader school={schoolDetailsItem() as SchoolType} />
      <SchoolHoursSlots school={schoolDetailsItem() as SchoolType} />

      <div class="panel-actions">
        <SchoolDetailsPanelsButton
          setOnPanel={setOnPanel}
          onPanel={onPanel}
          NbTrips={
            SchoolEntity.getSchoolTrips(schoolDetailsItem()?.id as number)
              .length
          }
        />
        <Show when={onPanel() == Panels.grades}>
          <ButtonIcon icon={<PlusIcon />} onClick={onClickAddGrade} />
        </Show>
      </div>

      <div class="board-content">
        <Switch>
          <Match when={onPanel() == Panels.grades}>
            <GradeList grades={schoolDetailsItem()?.grades as GradeType[]} />
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
