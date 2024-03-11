import { minuteToTime } from "../organism/RoadwaysDay";
import "./GradeSelection.css";

interface RoadwaysTimeItem {
  opt: number;
}

export function RoadwaysTimeItem(props: RoadwaysTimeItem) {
  return (
    <>
      <div>
        <div class="-ml-16 -mt-2.5 w-12 pr-2 text-right text-xs leading-5 text-gray-400">
          {minuteToTime(props.opt * 60, true)}
        </div>
      </div>
      <div />
    </>
  );
}
