import { createSignal } from "solid-js";
import { CheckableElement } from "../../../line/atom/CheckableElement";
import CollapsibleElement from "../../../line/atom/CollapsibleElement";
import "./MapOptionsPanel.css";

export const [displayPointsName, setDisplayPointsName] = createSignal(false);

export function MapOptionsPanel() {
  function pointsName() {
    if (displayPointsName()) setDisplayPointsName(false);
    else setDisplayPointsName(true);
  }

  return (
    <div class="map-options-panel">
      <CollapsibleElement title="Options d'affichage">
        <CheckableElement
          checked={displayPointsName()}
          displayQuantity={false}
          id={0}
          name="Afficher les noms"
          onChange={pointsName}
        />
      </CollapsibleElement>
    </div>
  );
}
