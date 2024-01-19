import { For, JSXElement } from "solid-js";
import { StopType } from "../../../../../_entities/stop.entity";
import { PanelStopItem } from "../molecule/PanelStopItem";

export function StopList(props: { stops: StopType[] }): JSXElement {
  return (
    <For each={props.stops}>{(stop) => <PanelStopItem stop={stop} />}</For>
  );
}
