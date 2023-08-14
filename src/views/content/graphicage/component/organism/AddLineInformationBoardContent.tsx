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
import { LeafletSchoolType } from "./SchoolPoints";

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
  const etablissementSelected = () =>
    getLineUnderConstruction().etablissementSelected;

  async function drawPolyline() {
    // TODO Put to BusLineEntity
    const latlngs: L.LatLng[] = await OsrmService.getRoadPolylineDraw(
      getLineUnderConstruction().stops
    );
    getLineUnderConstruction().setLatLngs(latlngs);

    // const busLinePolyline = buildLeafletPolyline("red", latlngs, 0.8);
    // console.log(getLineUnderConstruction());

    // console.log(busLinePolyline);

    // busLinePolyline.addTo(getLeafletMap() as L.Map);

    // line.setLatLngs(latlngs);
    // if (isInReadMode() && line.latLngs().length != 0) {
    //   setLocalLatLngs(line.latLngs());
    //   setLocalOpacity(0.8);
    // } else {
    //   setLocalLatLngs(getLatLngsFromPoint(line.points));
    //   setLocalOpacity(1);
    // }
  }

  return (
    <div class="add-line-information-board-content">
      <div class="add-line-information-board-content-header">
        <Show when={etablissementSelected()}>
          <SelectedSchool
            schoolSelected={etablissementSelected() as LeafletSchoolType[]}
          />
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
      <Show when={getLineUnderConstruction().stops.length != 0}>
        <div class="bus-line-information-board-content">
          <TimelineAddMode
            line={getLineUnderConstruction}
            setLine={setLineUnderConstruction}
          />
        </div>
      </Show>
      <Show when={getLineUnderConstruction().stops.length > 1}>
        <div class="">
          <Button
            onClick={quitModeAddLine}
            label={"Annuler"}
            variant="primary"
            isDisabled={false}
          />
          <Button
            onClick={drawPolyline}
            label={"Valider"}
            variant="primary"
            isDisabled={false}
          />
        </div>
      </Show>
    </div>
  );
}
