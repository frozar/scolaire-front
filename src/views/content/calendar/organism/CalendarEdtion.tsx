import { CalendarType } from "../../../../_entities/calendar.entity";
import { CalendarService } from "../../../../_services/calendar.service";
import Button from "../../../../component/atom/Button";
import { setCalendars, setCurrentCalendar } from "../template/Calendar";
import "./CalendarEdtion.css";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarLineAction } from "./CalendarLineAction";
import { CalendarLineContent } from "./CalendarLineContent";

export function CalendarEdition(props: {
  calendar: CalendarType;
  currentMonth: Date;
}) {
  function onClickCellAddDate(cellDate: Date) {
    setCurrentCalendar((prev) => {
      if (prev == undefined) return prev;
      const data = { ...prev };
      data.added.push(cellDate.getTime());
      return data;
    });
  }

  async function updateCalendar() {
    const calendar: CalendarType = await CalendarService.updateCalendar(
      props.calendar
    );

    setCalendars((prev) => {
      if (prev == undefined) return prev;
      const calendars = [...prev];
      const indexOfCalendar = calendars.findIndex(
        (item) => item.id == calendar.id
      );
      calendars[indexOfCalendar] = calendar;
      return calendars;
    });
  }

  return (
    <section class="calendar-edition">
      <p class="calendar-edition-title">
        Edition du calendrier :
        <span class="calendar-edition-title-active">
          {" " + props.calendar.name}
        </span>
      </p>

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
            calendar={props.calendar}
            month={props.currentMonth}
            onClickCell={onClickCellAddDate}
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
