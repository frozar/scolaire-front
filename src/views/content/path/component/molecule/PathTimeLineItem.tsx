import { JSXElement, Show, createEffect } from "solid-js";
import { NatureEnum } from "../../../../../type";
import { onBoard } from "../../../board/component/template/ContextManager";
import { TimeLineAddPPointButton } from "../atom/TimeLineAddPPointButton";

import "./PathTimeLineItem.css";

interface PathLineItemProps {
  timePassage?: string;
  calculated?: number;

  name: string;
  quantity: number;
  lineColor: string;
  pointNature: NatureEnum;
  index: number;
}

export function PathTimeLineItem(props: PathLineItemProps): JSXElement {
  createEffect(() => setLineColor(props.lineColor));

  return (
    <>
      {/* TODO: add mini + button to add point to path */}

      <div class="path-timeline-left">{props.timePassage}</div>
      <div class="path-timeline-line">
        <Show when={onBoard() == "path-draw"}>
          <TimeLineAddPPointButton
            onClick={() => console.log("ok")}
            text="tyeste"
          />
        </Show>
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
