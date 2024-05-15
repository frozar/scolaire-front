import { createSignal } from "solid-js";
import { CheckableElement } from "../../../line/atom/CheckableElement";
import "./MapOptionsPanel.css";

export const [displaySchoolName, setDisplaySchoolName] = createSignal(false);
export const [displayStopName, setDisplayStopName] = createSignal(false);

export function MapOptionsPanel() {
  function schoolName() {
    if (displaySchoolName()) setDisplaySchoolName(false);
    else setDisplaySchoolName(true);
  }

  function stopName() {
    if (displayStopName()) setDisplayStopName(false);
    else setDisplayStopName(true);
  }

  return (
    <div class="map-options-panel">
      <div>Options</div>
      <CheckableElement
        checked={displaySchoolName()}
        displayQuantity={false}
        id={0}
        name="Nom des écoles"
        onChange={schoolName}
      />
      <CheckableElement
        checked={displayStopName()}
        displayQuantity={false}
        id={0}
        name="Nom des arrêts"
        onChange={stopName}
      />
    </div>
  );
}
