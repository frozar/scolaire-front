import { createEffect, createSignal } from "solid-js";
import {
  CalendarPeriodType,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import { CalendarService } from "../../../../_services/calendar.service";
import Button from "../../../../component/atom/Button";
import { CalendarPeriodSelector } from "../atom/CalendarPeriodSelector";
import { CalendarSectionTitle } from "../atom/CalendarSectionTitle";
import { CalendarManager } from "../calendar.manager";
import { CalendarRules } from "../molecule/CalendarRules";
import {
  CalendarActionsEnum,
  calendarsPeriod,
  setCurrentCalendar,
} from "../template/Calendar";
import { CalendarEditionAddedDateWrapper } from "./CalendarEditionAddedDateWrapper";
import "./CalendarEdtion.css";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarLineAction } from "./CalendarLineAction";

interface CalendarEditionProps {
  calendar: CalendarType;
  currentMonth: Date;
}

export function CalendarEdition(props: CalendarEditionProps) {
  const [selectedCalendarPeriod, setSelectedCalendarPeriod] =
    createSignal<CalendarPeriodType>();

  createEffect(() => {
    setSelectedCalendarPeriod(
      calendarsPeriod().find(
        (item) => item.id == props.calendar.calendarPeriodId
      )
    );
  });

  function onClickCellAddDate(cellDate: Date) {
    console.log("onClickCell", cellDate);
  }

  // function onClickCellDeletedDate(cellDate: Date) {
  //   CalendarManager.toggleDeletedDate(cellDate);
  // }

  async function updateCalendar() {
    CalendarManager.updateCalendar(
      await CalendarService.updateCalendar(props.calendar)
    );
  }

  function onChangeCalendarPeriodSelector(calendarPeriod?: CalendarPeriodType) {
    CalendarManager.linkToPeriodCalendar(calendarPeriod);
  }

  function cancelEdition() {
    setCurrentCalendar(undefined);
  }

  function LabeledPeriodSelector() {
    return (
      <div class="inline-grid my-2">
        <label class="text-xl">Calendrier scolaire</label>
        <CalendarPeriodSelector
          onChange={onChangeCalendarPeriodSelector}
          defaultValue={props.calendar.calendarPeriodId}
        />
      </div>
    );
  }

  return (
    <section class="calendar-edition">
      <CalendarSectionTitle
        title="Edition du calendrier :"
        greenTitle={props.calendar.name}
      />

      <div class="calendar-table">
        <CalendarHeader month={props.currentMonth} />
        <div class="calendar-cells">
          <CalendarLineAction
            actionName="Calendrier en fonction des paramètrages"
            action={CalendarActionsEnum.rules}
            calendar={props.calendar}
            month={props.currentMonth}
            onClickCell={() => console.log("rule cell")}
          />
        </div>

        <div class="calendar-cells">
          <CalendarLineAction
            actionName="Ajouté"
            action={CalendarActionsEnum.add}
            calendar={props.calendar}
            month={props.currentMonth}
            onClickCell={onClickCellAddDate}
          />
        </div>

        {/* <div class="calendar-cells">
          <CalendarLineAction
            actionName="Retiré"
            action={CalendarActionsEnum.remove}
            calendar={props.calendar}
            month={props.currentMonth}
            onClickCell={onClickCellDeletedDate}
          />
        </div> */}

        <div class="calendar-cells">
          <CalendarLineAction
            actionName="Scolaire"
            action={CalendarActionsEnum.period}
            calendar={props.calendar}
            month={props.currentMonth}
            onClickCell={() => {
              false;
            }}
            calendarPeriod={selectedCalendarPeriod()}
            coloredCell={true}
          />
        </div>
      </div>

      <div class="calendar-edition-rules">
        <div>
          <CalendarSectionTitle title="Paramètrage calendrier" />
          <LabeledPeriodSelector />
        </div>

        <div class="flex gap-10">
          <div>
            <CalendarRules calendar={props.calendar} />
          </div>
          <CalendarEditionAddedDateWrapper dates={props.calendar.added} />
        </div>
      </div>

      <div class="calendar-edition-footer-actions mt-3">
        <Button
          onClick={cancelEdition}
          label="Annuler"
          variant="danger"
          isDisabled={false}
        />
        <Button
          onClick={updateCalendar}
          label="Mettre à jour"
          variant="primary"
          isDisabled={false}
        />
      </div>
    </section>
  );
}
