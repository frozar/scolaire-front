import { renderAnimation } from "../animation";

import { PointToDisplayType } from "../../../../type";

import "../../../../css/utils.css";
import { linkMap } from "../component/organism/Points";

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
