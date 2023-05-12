import ExportButton from "../export/ExportButton";
import MenuClear from "../menu/MenuClear";
// import MenuInformationsBoard from "../menu/MenuInformationsBoard";
import MenuDraw from "../menu/MenuDraw";
import MenuRemoveLine from "../menu/MenuRemoveLine";

export default function () {
  return (
    <div id="control-map-menu">
      {/* <MenuInformationsBoard /> */}
      <MenuDraw />
      <MenuRemoveLine />
      <MenuClear />
      <ExportButton />
    </div>
  );
}
