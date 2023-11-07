import { CalendarType } from "../../../../_entities/calendar.entity";
import { CalendarService } from "../../../../_services/calendar.service";
import Button from "../../../../component/atom/Button";
import { CalendarSectionTitle } from "../atom/CalendarSectionTitle";
import {
  toggleAddedDate,
  toggleDeletedDate,
  updateCalendars,
} from "../template/Calendar";
import "./CalendarEdtion.css";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarLineAction } from "./CalendarLineAction";
import { CalendarLineContent } from "./CalendarLineContent";

export function CalendarEdition(props: {
  calendar: CalendarType;
  currentMonth: Date;
}) {
  function onClickCellAddDate(cellDate: Date) {
    toggleAddedDate(cellDate);
  }

  function onClickCellDeletedDate(cellDate: Date) {
    console.log("remove date:", cellDate);

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
          <CalendarLineContent
            month={props.currentMonth}
            calendar={props.calendar}
          />
        </div>

        <div class="calendar-cells">
          <CalendarLineAction
            actionName="Ajouté"
            action="add"
            calendar={props.calendar}
            month={props.currentMonth}
            onClickCell={onClickCellAddDate}
          />
        </div>

        <div class="calendar-cells">
          <CalendarLineAction
            actionName="Retiré"
            action="remove"
            calendar={props.calendar}
            month={props.currentMonth}
            onClickCell={onClickCellDeletedDate}
          />
        </div>
      </div>

      <div class="calendar-edition-footer-actions">
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
