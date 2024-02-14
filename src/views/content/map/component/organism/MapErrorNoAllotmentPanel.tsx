import { setSelectedMenu } from "../../../../layout/menuItemFields";
import CollapsibleElement from "../../../board/component/organism/CollapsibleElement";

export function MapErrorNoAllotmentPanel() {
  function goToAllotmentPage() {
    setSelectedMenu("allotment");
  }

  return (
    <CollapsibleElement
      title="Aucun lot n'a été créé"
      titleClass="text-orange-base"
      closedByDefault={() => true}
    >
      <div class="information-panel-link" onClick={goToAllotmentPage}>
        Page des allotissements
      </div>
    </CollapsibleElement>
  );
}
