import { JSXElement } from "solid-js";
import { NatureEnum } from "../../../../../type";

interface PathLineItemProps {
  timePassage?: string;
  name: string;
  quantity: number;
  calculated: number;
  lineColor: string;
  pointNature: NatureEnum;
}

export function PathTimeLineItem(props: PathLineItemProps): JSXElement {
  return (
    <>
      <div class="path-timeline-left">{props.timePassage}</div>
      <div class={"path-timeline-line " + props.lineColor}>
        <div
          class="path-timeline-circle"
          classList={{
            "!bg-dark-teal": props.pointNature == NatureEnum.stop,
            "!bg-red-teal": props.pointNature == NatureEnum.school,
          }}
        />
      </div>
      <div class="path-timeline-component path-timeline-content">
        <p class="count-to-get">{props.quantity}</p>
        <p class="stop-name">{props.name}</p>
        <p class="totalcount">{props.calculated}</p>
      </div>
    </>
  );
}
