import ExportButton from "../export/ExportButton";
import GenerateButton from "../menu/GenerateButton";
import MenuClear from "../menu/MenuClear";
import MenuDraw from "../menu/MenuDraw";
import MenuRemoveLine from "../menu/MenuRemoveLine";

export default function () {
  return (
    <div id="control-map-menu">
      <MenuDraw />
      <MenuRemoveLine />
      <MenuClear />
      <GenerateButton />
      <ExportButton />
    </div>
  );
}
