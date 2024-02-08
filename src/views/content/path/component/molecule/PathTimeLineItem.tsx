import { JSXElement, createEffect } from "solid-js";
import { NatureEnum } from "../../../../../type";
import { TimeLineAction } from "./TimeLineAction";

import { setCurrentTripIndex } from "../../../board/component/organism/DrawTripBoard";
import { LeftTimeLineContent } from "../atom/LeftTimeLineContent";
import { TimeLineCircle } from "../atom/TimeLineCircle";
import { RightTimeLineContent } from "./RightTimeLineContent";

import "./PathTimeLineItem.css";

interface PathLineItemProps {
  timePassage?: string;
  calculated?: number;

  name: string;
  quantity: number;
  lineColor: string;
  pointNature: NatureEnum;
  index: number;
  pointId: number;

  onClickDelete: (id: number) => void;
}

export function PathTimeLineItem(props: PathLineItemProps): JSXElement {
  createEffect(() => setLineColor(props.lineColor));

  return (
    <>
      <LeftTimeLineContent text={props.timePassage?.toString() ?? ""} />
      <div class="path-timeline-line">
        <TimeLineAction
          onClick={() => setCurrentTripIndex(props.index)}
          text="Sélectionnez un point sur la carte"
        />
        <TimeLineCircle
          onClickDelete={props.onClickDelete}
          nature={props.pointNature}
          pointId={props.pointId}
        />
      </div>
      <RightTimeLineContent
        countToGet={props.quantity.toString()}
        name={props.name}
        totalCount={props.calculated?.toString() ?? ""}
      />
    </>
  );
}

function setLineColor(color: string) {
  const lines = document.getElementsByClassName("path-timeline-line");
  for (const line of lines) line.setAttribute("style", "background:" + color);
}
