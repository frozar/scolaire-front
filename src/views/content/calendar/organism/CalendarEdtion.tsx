import { CalendarType } from "../../../../_entities/calendar.entity";
import { CalendarService } from "../../../../_services/calendar.service";
import Button from "../../../../component/atom/Button";
import { CalendarSectionTitle } from "../atom/CalendarSectionTitle";
import { CalendarDaysCheckbox } from "../molecule/CalendarDaysCheckbox";
import {
  CalendarActionsEnum,
  toggleAddedDate,
  toggleDeletedDate,
  updateCalendars,
} from "../template/Calendar";
import "./CalendarEdtion.css";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarLineAction } from "./CalendarLineAction";

interface CalendarEditionProps {
  calendar: CalendarType;
  currentMonth: Date;
}

export function CalendarEdition(props: CalendarEditionProps) {
  function onClickCellAddDate(cellDate: Date) {
    toggleAddedDate(cellDate);
  }

  function onClickCellDeletedDate(cellDate: Date) {
    toggleDeletedDate(cellDate);
  }

  async function updateCalendar() {
    updateCalendars(await CalendarService.updateCalendar(props.calendar));
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

        <div class="calendar-cells">
          <CalendarLineAction
            actionName="Retiré"
            action={CalendarActionsEnum.remove}
            calendar={props.calendar}
            month={props.currentMonth}
            onClickCell={onClickCellDeletedDate}
          />
        </div>
      </div>

      <div class="calendar-edition-footer-actions">
        <div>
          <CalendarSectionTitle title="Paramètrage calendrier" />
          <CalendarDaysCheckbox calendar={props.calendar} />
        </div>

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
