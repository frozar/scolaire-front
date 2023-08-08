import { renderAnimation } from "../animation";

import "../../../../css/utils.css";
import { linkMap } from "../component/organism/Points";
import { LeafletSchoolType } from "../component/organism/SchoolPoints";
import { LeafletStopType } from "../component/organism/StopPoints";

export default function (props: {
  point: LeafletSchoolType | LeafletStopType;
}) {
  return (
    <a
      class="prevent-select"
      style={{ cursor: "grab" }}
      onClick={() => {
        let element;

        if ((element = linkMap.get(props.point.leafletId)?.getElement())) {
          renderAnimation(element);
        }
      }}
    >
      {props.point.name}
    </a>
  );
}
