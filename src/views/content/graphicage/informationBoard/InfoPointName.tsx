import { renderAnimation } from "../animation";

import "../../../../css/utils.css";
import { PointIdentityType } from "../component/atom/Point";
import { linkMap } from "../component/organism/Points";

export default function (props: { point: PointIdentityType }) {
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
