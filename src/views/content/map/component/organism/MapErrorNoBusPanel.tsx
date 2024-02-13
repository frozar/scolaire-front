import { setSelectedMenu } from "../../../../layout/menuItemFields";
import CollapsibleElement from "../../../board/component/organism/CollapsibleElement";
import "./MapErrorNoBusPanel.css";

export function MapErrorNoBusPanel() {
  function goToBusPage() {
    console.log("clicked");
    setSelectedMenu("bus");
  }

  return (
    <CollapsibleElement
      title="Aucun bus n'a été créé"
      titleClass="text-orange-base"
      closedByDefault={() => true}
    >
      <div class="information-panel-link" onClick={goToBusPage}>
        Page de gestion de Bus
      </div>
    </CollapsibleElement>
  );
}
