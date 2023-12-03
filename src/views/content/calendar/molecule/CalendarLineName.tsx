import TrashIcon from "../../../../icons/TrashIcon";
import ButtonIcon from "../../board/component/molecule/ButtonIcon";
import "./CalendarLineName.css";

interface CalendarLineNameProps {
  calendarName: string;
  onClickDeleteCalendar: () => void;
}
export function CalendarLineName(props: CalendarLineNameProps) {
  return (
    <div class="calendar-line-name">
      <p>{props.calendarName}</p>
      <ButtonIcon icon={<TrashIcon />} onClick={props.onClickDeleteCalendar} />
    </div>
  );
}
