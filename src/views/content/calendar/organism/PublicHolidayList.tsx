import { For } from "solid-js";
import { CalendarPeriodType } from "../../../../_entities/calendar.entity";
import { PublicHolidayItem } from "./PublicHolidayItem";

interface PublicHolidayListProps {
  calendarPeriod: CalendarPeriodType;
}

export function PublicHolidayList(props: PublicHolidayListProps) {
  return (
    <For each={props.calendarPeriod.publicHolidays}>
      {(item) => <PublicHolidayItem item={item} />}
    </For>
  );
}
