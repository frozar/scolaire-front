import { NatureEnum } from "../../../../../type";

import "./TimeLineCircle.css";

export function TimeLineCircle(props: { nature: NatureEnum }) {
  return (
    <div
      class="path-timeline-circle"
      classList={{
        "!bg-dark-teal": props.nature == NatureEnum.stop,
        "!bg-red-teal": props.nature == NatureEnum.school,
      }}
    />
  );
}
