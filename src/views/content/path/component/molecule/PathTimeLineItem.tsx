import { JSXElement, createEffect } from "solid-js";
import { NatureEnum } from "../../../../../type";

interface PathLineItemProps {
  timePassage?: string;
  calculated?: number;

  name: string;
  quantity: number;
  lineColor: string;
  pointNature: NatureEnum;
}

export function PathTimeLineItem(props: PathLineItemProps): JSXElement {
  createEffect(() => setLineColor(props.lineColor));

  return (
    <>
      {/* TODO: add mini + button to add point to path */}
      {/* <Show when={onBoard() == "trip-draw"}>
        <TripTimelineAddPointButton indice={i()} />
      </Show> */}

      <div class="path-timeline-left">{props.timePassage}</div>
      <div class="path-timeline-line ">
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
        <p class="total-count">{props.calculated}</p>
      </div>
    </>
  );
}

function setLineColor(color: string) {
  const lines = document.getElementsByClassName("path-timeline-line");
  for (const line of lines) line.setAttribute("style", "background:" + color);
}
