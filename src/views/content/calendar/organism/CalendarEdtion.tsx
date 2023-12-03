import { createEffect, createSignal } from "solid-js";
import {
  CalendarPeriodType,
  CalendarType,
} from "../../../../_entities/calendar.entity";
import { CalendarService } from "../../../../_services/calendar.service";
import Button from "../../../../component/atom/Button";
import { LabeledInputSelect } from "../../../../component/molecule/LabeledInputSelect";
import { disableSpinningWheel, enableSpinningWheel } from "../../../../signaux";
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

  async function updateCalendar() {
    enableSpinningWheel();
    CalendarManager.updateCalendar(
      await CalendarService.updateCalendar(props.calendar)
    );
    disableSpinningWheel();
  }

  function onChangeCalendarPeriodSelector(value: number | string) {
    const calendarPeriod = calendarsPeriod().find((item) => item.id == value);
    CalendarManager.linkToPeriodCalendar(calendarPeriod);
  }

  function cancelEdition() {
    setCurrentCalendar(undefined);
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
          />
        </div>

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
          <LabeledInputSelect
            defaultOptions="Choisir un calendrier scolaire"
            defaultValue={props.calendar.calendarPeriodId ?? 0}
            label="Calendrier scolaire"
            onChange={onChangeCalendarPeriodSelector}
            options={calendarsPeriod().map((item) => {
              return { value: item.id, text: item.name };
            })}
          />
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
