import { DateAddedType } from "../../../../_entities/calendar.entity";
import { CalendarSectionTitle } from "../atom/CalendarSectionTitle";
import { DateItem } from "../molecule/DateItem";
import { AddedDateList } from "./AddedDateList";

import "./CalendarEditionAddedDateWrapper.css";
interface CalendarEditionAddedDateWrapperProps {
  dates: DateAddedType[];
}

export function CalendarEditionAddedDateWrapper(
  props: CalendarEditionAddedDateWrapperProps
) {
  return (
    <div>
      <CalendarSectionTitle title="Date ajouté" />
      <div class="list-wrapper">
        <AddedDateList dates={props.dates} />
        <DateItem />
      </div>
    </div>
  );
}
