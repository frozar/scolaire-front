import CellItem from "../atom/CellItem";
import { CalendarUtils } from "../calendar.utils";

export function CellItemLogic(props: {
  month: Date;
  day: number;
  actifDays: Date[];
}) {
  const currentDate = () =>
    new Date(props.month.getFullYear(), props.month.getMonth(), props.day);

  const isActive = () =>
    props.actifDays.find((date) => date.getTime() == currentDate().getTime()) !=
    undefined;

  return (
    <CellItem
      isActive={isActive()}
      isWeekend={CalendarUtils.isWeekend(currentDate())}
      onClick={() => {
        console.log(CalendarUtils.getNameDay(currentDate()));
        console.log(isActive());
      }}
    />
  );
}
