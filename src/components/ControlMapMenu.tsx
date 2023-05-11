import ExportButton from "../export/ExportButton";
import MenuClear from "../menu/MenuClear";
import { TogglerInformationBoard } from "../menu/Menu";
import MenuDraw from "../menu/MenuDraw";
import MenuRemoveLine from "../menu/MenuRemoveLine";

export default function () {
  return (
    <div id="control-map-menu">
      <MenuDraw />
      <MenuRemoveLine />
      <MenuClear />
      <ExportButton />
      <TogglerInformationBoard />
    </div>
  );
}
