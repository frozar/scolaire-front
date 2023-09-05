import { renderAnimation } from "../../../graphicage/animation";

import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { linkMap } from "../../../graphicage/component/organism/Points";

export default function (props: { point: SchoolType | StopType }) {
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
