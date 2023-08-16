import L from "leaflet";
import { Show } from "solid-js";
import { useStateAction } from "../../../../../StateAction";
import { OsrmService } from "../../../../../_services/osrm.service";
import Button from "../../../../../component/atom/Button";
import TimelineAddMode from "../../informationBoard/TimelineAddMode";
import { quitModeAddLine } from "../../shortcut";
import { DrawHelperButton } from "../atom/DrawHelperButton";
import SelectedSchool from "../atom/SelectedSchool";
import "./AddLineInformationBoardContent.css";

const [
  ,
  {
    getLineUnderConstruction,
    setLineUnderConstruction,
    confirmEtablissementSelection,
  },
] = useStateAction();
export default function () {
  const isValidate = () => getLineUnderConstruction().confirmSelection;
  const etablissementSelected = () => {
    return getLineUnderConstruction().busLine.schools;
  };

  async function addLineUnderConstructionPolylineWithOsrm() {
    // TODO Put to BusLineEntity
    const latlngs: L.LatLng[] = await OsrmService.getRoadPolyline(
      getLineUnderConstruction().busLine.points
    );
    getLineUnderConstruction().busLine.setLatLngs(latlngs);
  }

  return (
    <div class="add-line-information-board-content">
      <div class="add-line-information-board-content-header">
        <Show when={etablissementSelected()}>
          <SelectedSchool schoolSelected={etablissementSelected()} />
        </Show>

        <Show
          when={typeof etablissementSelected() != "undefined" && isValidate()}
        >
          <DrawHelperButton schools={etablissementSelected()} />
        </Show>
      </div>

      <Show
        when={
          etablissementSelected() &&
          etablissementSelected()?.length != 0 &&
          !getLineUnderConstruction().confirmSelection
        }
      >
        <div class="confirm-etablissement-selection">
          <Button onClick={confirmEtablissementSelection} label="Valider" />
        </div>
      </Show>
      <Show when={getLineUnderConstruction().busLine.points.length != 0}>
        <div class="bus-line-information-board-content">
          <TimelineAddMode
            line={getLineUnderConstruction}
            setLine={setLineUnderConstruction}
          />
        </div>
      </Show>
      <Show when={getLineUnderConstruction().busLine.points.length > 1}>
        <div class="">
          <Button
            onClick={quitModeAddLine}
            label={"Annuler"}
            variant="primary"
            isDisabled={false}
          />
          <Button
            onClick={addLineUnderConstructionPolylineWithOsrm}
            label={"Valider"}
            variant="primary"
            isDisabled={false}
          />
        </div>
      </Show>
    </div>
  );
}
