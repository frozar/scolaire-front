import L from "leaflet";
import { onMount } from "solid-js";

import logoWithBaseline from "./assets/logo-baseline.svg";

export default function MapLogo() {
  let componentRef: HTMLDivElement = document.createElement("div");

  onMount(() => {
    L.DomEvent.disableClickPropagation(componentRef);
  });

  const widthValue = "150px";

  return (
    <div
      id="map-logo"
      ref={componentRef}
      class="leaflet-bar leaflet-control logo-control"
      style="border: none;"
    >
      <a
        style={
          "width:" +
          widthValue +
          "; display: block;height: unset;background: unset;"
        }
        href="https://flaxib.re"
        target="_blank"
      >
        <div class="logo-container box-showoff prevent-select">
          <img
            width={widthValue}
            class="logo-control-img"
            alt="Logo Flaxib"
            src={logoWithBaseline}
          />
        </div>
      </a>
    </div>
  );
}