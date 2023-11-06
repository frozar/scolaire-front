import { CalendarType } from "../../../../_entities/calendar.entity";
import "./CalendarEdtion.css";

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
    </section>
  );
}
