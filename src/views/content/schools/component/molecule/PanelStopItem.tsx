import _ from "lodash";
import { JSXElement } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import CardTitle from "../../../../../component/atom/CardTitle";
import CardWrapper from "../../../../../component/molecule/CardWrapper";
import { changeBoard } from "../../../board/component/template/ContextManager";
import { setStopDetailsItem } from "../../../stops/component/organism/StopDetails";

export function PanelStopItem(props: { stop: StopType }): JSXElement {
  function onClick() {
    setStopDetailsItem(_.cloneDeep(props.stop));
    changeBoard("stop-details");
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
