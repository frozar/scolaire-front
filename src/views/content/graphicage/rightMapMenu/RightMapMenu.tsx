import AddLineButton from "./AddLineButton";
import RemoveLineButton from "./RemoveLineButton";
import ClearButton from "./ClearButton";
import GenerateButton from "./GenerateButton";
import ExportButton from "./ExportButton";
import InformationBoardButton from "./InformationBoardButton";

export default function () {
  return (
    <div id="control-map-menu">
      <InformationBoardButton />
      <AddLineButton />
      <RemoveLineButton />
      <ClearButton />
      <GenerateButton />
      <ExportButton />
    </div>
  );
}
