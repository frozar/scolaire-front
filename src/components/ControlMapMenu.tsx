import ExportButton from "../export/ExportButton";
import MenuClear from "../menu/MenuClear";
import InformationsBoard from "../menu/InformationsBoard";
import MenuDraw from "../menu/MenuDraw";
import MenuRemoveLine from "../menu/MenuRemoveLine";

export default function () {
  return (
    <div id="control-map-menu">
      <InformationsBoard />
      <MenuDraw />
      <MenuRemoveLine />
      <MenuClear />
      <ExportButton />
    </div>
  );
}
