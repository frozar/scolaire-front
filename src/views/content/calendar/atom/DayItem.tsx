import "./DayItem.css";

export default function (props: { day: Date }) {
  return <div class="day-item">{props.day.getDate()}</div>;
}
