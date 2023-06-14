// import { NatureEnum } from "../../../../type";
import { renderAnimation } from "../animation";

import { linkMap } from "../../../../global/linkPointIdentityCircle";
import { PointToDisplayType } from "./InformationContent";

export default function (props: {
  // point: {
  //   id_point: number;
  //   name: string;
  //   // nature: NatureEnum; // utilisé null part ?
  // };
  point: PointToDisplayType;
}) {
  return (
    <a
      class="prevent-select"
      // eslint-disable-next-line solid/style-prop
      style="cursor: grab;"
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
