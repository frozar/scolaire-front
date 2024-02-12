import { JSXElement } from "solid-js";
import { Filters } from "./Filters";
import { MapErrorPanel } from "./MapErrorPanel";
import { MapInformationPanel } from "./MapInformationPanel";

export function MapPanels(): JSXElement {
  return (
    <>
      <Filters />
      <MapInformationPanel />
      <MapErrorPanel />
    </>
  );
}
