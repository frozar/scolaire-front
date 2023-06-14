import { renderAnimation } from "../animation";

import { linkMap } from "../../../../global/linkPointIdentityCircle";
import { PointToDisplayType } from "./InformationContent";

export default function (props: { point: PointToDisplayType }) {
  return (
    <a
      class="prevent-select"
      style={{ cursor: "grab" }}
      onClick={() => {
        let element;
        if ((element = linkMap.get(props.point.id_point)?.getElement())) {
          renderAnimation(element);
        }
      }}
    >
      {props.point.name}
    </a>
  );
}
