import { Show, createSignal, onCleanup, onMount } from "solid-js";
import { SchoolType } from "../../../../../_entities/school.entity";
import { LabeledInputSelect } from "../../../../../component/molecule/LabeledInputSelect";
import { MapElementUtils } from "../../../../../utils/mapElement.utils";
import { SchoolDetailUtils } from "../../../../../utils/school-details.utils";
import { SchoolUtils } from "../../../../../utils/school.utils";
import BoardFooterActions from "../../../board/component/molecule/BoardFooterActions";
import CollapsibleElement from "../../../board/component/organism/CollapsibleElement";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { calendars } from "../../../calendar/template/Calendar";
import SchoolDetailsHeader from "../molecule/SchoolDetailsHeader";
import { HourRuleList } from "./HourRuleList";
import { SchoolDetailsPanels } from "./SchoolDetailsPanels";
import { SchoolHoursSlots } from "./SchoolHoursSlots";

import "./SchoolDetails.css";

export const [schoolDetailsItem, setSchoolDetailsItem] =
  createSignal<SchoolType>();
export const [schoolDetailEditing, setSchoolDetailEditing] =
  createSignal<boolean>(false);

export default function () {
  onMount(() => {
    if (schoolDetailsItem() == undefined) {
      changeBoard("schools");
      MapElementUtils.deselectAllPointsAndBusTrips();
    }
  });

  function onChangeCalendarSelect(value: number | string) {
    SchoolUtils.linkSchoolToCalendar(value as number);
  }

  onCleanup(() => setSchoolDetailEditing(false));
  return (
    <section>
      <SchoolDetailsHeader school={schoolDetailsItem() as SchoolType} />
      {/* TODO: Put following in an other file */}
      <LabeledInputSelect
        defaultOptions="Sélectionner calendrier"
        defaultValue={schoolDetailsItem()?.calendar?.id ?? 0}
        label="Calendrier lié"
        onChange={onChangeCalendarSelect}
        options={calendars().map((item) => {
          return { value: item.id, text: item.name };
        })}
        disabled={!schoolDetailEditing()}
        indented={true}
      />

      <div class="time">
        <CollapsibleElement
          title="Tranches horaires"
          titleClass="text-xl"
          closedByDefault={true}
        >
          <SchoolHoursSlots school={schoolDetailsItem() as SchoolType} />

          <HourRuleList
            item={schoolDetailsItem}
            setItem={setSchoolDetailsItem}
            disabled={schoolDetailEditing()}
          />
        </CollapsibleElement>
      </div>
      <Show
        when={!schoolDetailEditing()}
        fallback={
          <BoardFooterActions
            nextStep={{
              callback: SchoolDetailUtils.edit,
              label: "Valider",
            }}
            previousStep={{
              callback: () => setSchoolDetailEditing(false),
              label: "Annuler",
            }}
          />
        }
      >
        <SchoolDetailsPanels />
      </Show>
    </section>
  );
}
