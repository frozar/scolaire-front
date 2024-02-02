import { For } from "solid-js";
import { PathType } from "../../../../../_entities/path.entity";
import { PathTimeLineItem } from "../molecule/PathTimeLineItem";

import { SchoolType } from "../../../../../_entities/school.entity";
import { StopType } from "../../../../../_entities/stop.entity";
import { NatureEnum } from "../../../../../type";
import { PathUtil } from "../../../../../utils/path.utils";
import "./PathTimeLine.css";

interface PathLineProps {
  path: PathType;
}

export function PathTimeLine(props: PathLineProps) {
  // * process each point to get neccessary informations like name, calculated quantity, time passage, quantity to get or drop
  // * then save each processed point in new array
  // ! reactivity is important

  const points = () =>
    props.path.points.map((point) => {
      const point_ = PathUtil.getPathPoint(point);
      const quantity = getPointQuantity(point_, props.path.grades);

      const pointInformations = {
        name: point_.name,
        nature: point_.nature,
        quantity: quantity,
      };

      return pointInformations;
    });

  return (
    <div class="path-timeline">
      <For each={points()}>
        {(point) => (
          <PathTimeLineItem
            name={point.name}
            quantity={point.quantity ?? 0}
            lineColor={props.path.color}
            pointNature={point.nature}
          />
        )}
      </For>
    </div>
  );
}

function getPointQuantity(
  point: StopType | SchoolType,
  pathGradesIds: number[]
) {
  if (point.nature == NatureEnum.stop)
    return point.associated.reduce((accumulator, association) => {
      if (pathGradesIds.includes(association.gradeId))
        return accumulator + association.quantity;
      else return accumulator;
    }, 0);
  else return 0;
}
