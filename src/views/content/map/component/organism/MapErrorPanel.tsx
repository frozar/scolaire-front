import { Show, createSignal } from "solid-js";
import { MapErrorNoBusPanel } from "./MapErrorNoBusPanel";

export const [thereIsAnError, setThereIsAnError] = createSignal(false);
export const [noBusError, setnoBusError] = createSignal(false);

export function MapErrorPanel() {
  return (
    <Show when={thereIsAnError()}>
      <div id="map-information-panel">
        <Show when={noBusError()}>
          <MapErrorNoBusPanel />
        </Show>
      </div>
    </Show>
  );
}
