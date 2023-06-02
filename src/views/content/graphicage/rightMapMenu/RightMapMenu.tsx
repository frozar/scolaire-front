import AddLineButton from "./AddLineButton";
import RemoveLineButton from "./RemoveLineButton";
import ClearButton from "./ClearButton";
import GenerateButton from "./GenerateButton";
import ExportButton from "./ExportButton";
import InformationBoardButton from "./InformationBoardButton";
import OpenLayerChoice from "./OpenLayerChoice";
import { useStateGui } from "../../../../StateGui";

const [, { getDisplayedLayerChoiceMenu }] = useStateGui();

export default function () {
  return (
    <div
      id="control-map-menu"
      classList={{ "active-layer-choice": getDisplayedLayerChoiceMenu() }}
    >
      <InformationBoardButton />
      <AddLineButton />
      <RemoveLineButton />
      <ClearButton />
      <GenerateButton />
      <ExportButton />
      <OpenLayerChoice />
    </div>
  );
}
