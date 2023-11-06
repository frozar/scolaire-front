import { CalendarType } from "../../../../_entities/calendar.entity";
import "./CalendarEdtion.css";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarLineContent } from "./CalendarLineContent";

export function CalendarEdition(props: {
  calendar: CalendarType;
  currentMonth: Date;
}) {
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
      </div>
    </section>
  );
}
