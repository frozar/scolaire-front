import { renderAnimation } from "../animation";

import { PointToDisplayType } from "../../../../type";
import { linkMap } from "../Point";

import "../../../../css/utils.css";

export default function (props: { point: PointToDisplayType }) {
  return (
    <a
      class="prevent-select"
      style={{ cursor: "grab" }}
      onClick={() => {
        let element;

        if ((element = linkMap.get(props.point.idPoint)?.getElement())) {
          renderAnimation(element);
        }
      }}
    >
      {props.point.name}
    </a>
  );
}
