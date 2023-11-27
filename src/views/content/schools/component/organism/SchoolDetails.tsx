import {
  Match,
  Show,
  Switch,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { GradeType } from "../../../../../_entities/grade.entity";
import {
  SchoolEntity,
  SchoolType,
} from "../../../../../_entities/school.entity";
import { LabeledInputSelect } from "../../../../../component/molecule/LabeledInputSelect";
import PlusIcon from "../../../../../icons/PlusIcon";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { SchoolUtils } from "../../../../../utils/school.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { calendars } from "../../../calendar/template/Calendar";
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

  function onChangeCalendarSelect(value: number | string) {
    SchoolUtils.linkCalendarToSchool(value as number);
  }

  onCleanup(() => setSchoolDetailEditing(false));
  return (
    <section>
      <SchoolDetailsHeader school={schoolDetailsItem() as SchoolType} />
      <LabeledInputSelect
        defaultOptions="Sélectionner calendrier"
        defaultValue={schoolDetailsItem()?.calendar?.id ?? 0}
        label="Calendrier lié"
        onChange={onChangeCalendarSelect}
        options={calendars().map((item) => {
          return { value: item.id, text: item.name };
        })}
        disabled={!schoolDetailEditing()}
      />

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
