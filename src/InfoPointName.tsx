import hash from "object-hash";

import { NatureEnum } from "./type";
import { renderAnimation } from "./animation";

import { linkMap } from "./global/linkPointIdentityCircle";

export default function InfoPointName(props: {
  point: {
    id_point: number;
    name: string;
    nature: NatureEnum;
  };
}) {
  const point = props.point;

  return (
    <a
      class="prevent-select"
      style="cursor: grab;"
      onClick={() => {
        let element;
        if ((element = linkMap.get(point.id_point)?.getElement())) {
          renderAnimation(element);
        }
      }}
    >
      {point.name}
    </a>
  );
}
