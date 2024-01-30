import { JSXElement } from "solid-js";
import { Filters } from "./Filters";
import { MapInformationPanel } from "./MapInformationPanel";

export function MapPanels(): JSXElement {
  return (
    <>
      <Filters />
      <MapInformationPanel />
    </>
  );
}
