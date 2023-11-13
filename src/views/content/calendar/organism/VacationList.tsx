import { For } from "solid-js";
import { CalendarPeriodType } from "../../../../_entities/calendar.entity";
import { VacationItem } from "./VacationItem";

interface VacationListProps {
  calendarPeriod: CalendarPeriodType;
}

export function VacationList(props: VacationListProps) {
  return (
    <For each={props.calendarPeriod.vacationsPeriod}>
      {(item) => <VacationItem item={item} />}
    </For>
  );
}
