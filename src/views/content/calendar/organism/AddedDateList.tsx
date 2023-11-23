import { For } from "solid-js";
import { DateAddedType } from "../../../../_entities/calendar.entity";
import { DateItem } from "../molecule/DateItem";

interface AddedDateListProps {
  dates: DateAddedType[];
}

export function AddedDateList(props: AddedDateListProps) {
  return (
    <div class="date-list">
      <For each={props.dates}>
        {(date) => {
          return <DateItem date={date} />;
        }}
      </For>
    </div>
  );
}
