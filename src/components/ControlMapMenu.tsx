import ExportButton from "../export/ExportButton";
import MenuDraw from "../menu/MenuDraw";
import MenuRemoveLine from "../menu/MenuRemoveLine";

export default function () {
  return (
    <div id="control-map-menu">
      <MenuDraw />
      <MenuRemoveLine />
      <ExportButton />
    </div>
  );
}
