import "./CalendarContent.css";
import CellList from "./CellList";

export default function (props: { month: Date }) {
  // const calendarsJson = [
  //   {
  //     calendarName: "Calendrier maternel",
  //     rules: ["monday", "tuesday", "thursday", "friday"],
  //     date_added: ["01-01-2023"],
  //     dated_deleted: ["02-01-2023"],
  //   },
  // ];

  return (
    <div class="calendar-cells">
      <p class="calendar-name">tets</p>
      <CellList month={props.month} />
    </div>
  );
}
