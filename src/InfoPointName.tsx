import hash from "object-hash";

import { NatureEnum } from "./type";
import { renderAnimation } from "./animation";

import { linkMap } from "./global/linkPointIdentityCircle";

export default function InfoPointName(props: {
  point: {
    id: number;
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
        const key = {
          id: point.id,
          nature: point.nature,
        };
        let element;
        if ((element = linkMap.get(key)?.getElement())) {
          renderAnimation(element);
        }
      }}
    >
      {point.name}
    </a>
  );
}
