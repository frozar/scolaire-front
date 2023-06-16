import { renderAnimation } from "../animation";

import { linkMap } from "../../../../global/linkPointIdentityCircle";
import { PointToDisplayType } from "../../../../type";

export default function (props: { point: PointToDisplayType }) {
  return (
    <a
      class="prevent-select"
      style={{ cursor: "grab" }}
      onClick={() => {
        let element;
        console.log(props.point);

        if ((element = linkMap.get(props.point.idPoint)?.getElement())) {
          renderAnimation(element);
        }
      }}
    >
      {props.point.name}
    </a>
  );
}
