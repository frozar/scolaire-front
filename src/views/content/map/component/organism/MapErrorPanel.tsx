import { Show, createSignal } from "solid-js";
import { MapErrorNoAllotmentPanel } from "./MapErrorNoAllotmentPanel";
import { MapErrorNoBusPanel } from "./MapErrorNoBusPanel";

export const [thereIsAnError, setThereIsAnError] = createSignal(false);
export const [noBusError, setnoBusError] = createSignal(false);
export const [noAllotmentError, setNoAllotmentError] = createSignal(false);

export function MapErrorPanel() {
  return (
    <Show when={thereIsAnError()}>
      <div id="map-information-panel">
        <Show when={noBusError()}>
          <MapErrorNoBusPanel />
        </Show>
        <Show when={noAllotmentError()}>
          <MapErrorNoAllotmentPanel />
        </Show>
      </div>
    </Show>
  );
}
