import { JSXElement } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import { ViewManager } from "../../../ViewManager";

export function PanelStopItem(props: { stop: StopType }): JSXElement {
  function onClick() {
    ViewManager.stopDetails(props.stop);
  }
  // TODO: Display qty ?
  return (
    <CardWrapper class="grade-item" onClick={onClick}>
      <div class="left">
        <CardTitle title={props.stop.name} />
      </div>
    </CardWrapper>
  );
}
