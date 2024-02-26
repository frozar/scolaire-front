import { createSignal } from "solid-js";
import { TextInput } from "../../../../../component/atom/TextInput";
import { TableData } from "../../../../../component/table/atom/TableData";
import { TableDataChilds } from "../../../../../component/table/molecule/TableDataChilds";
import { TableRow } from "../../../../../component/table/molecule/TableRow";
import CheckIcon from "../../../../../icons/CheckIcon";
import { CloseIcon } from "../../../../../icons/CloseIcon";
import { addNewUserInformation } from "../../../../../signaux";
import { MessageLevelEnum, MessageTypeEnum } from "../../../../../type";
import { MapsUtils } from "../../../../../utils/maps.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { setIsDisplayedCreateMap } from "../../Maps";

export function MapTableItemAdd() {
  const [mapName, setMapName] = createSignal<string>("");

  async function addMap() {
    if (!mapName() || mapName() === "") {
      return addNewUserInformation({
        content: "Veuillez entrer un nom de carte",
        displayed: true,
        level: MessageLevelEnum.error,
        type: MessageTypeEnum.global,
      });
    }

    await MapsUtils.createMap({ name: mapName() });
    setIsDisplayedCreateMap(false);
  }

  function close() {
    setIsDisplayedCreateMap(false);
  }

  return (
    <TableRow active={true}>
      <TableDataChilds>
        <TextInput
          placeholder="Nom de la carte"
          defaultValue={mapName()}
          onInput={(value) => setMapName(value)}
        />
      </TableDataChilds>
      <TableData text="" end={false} />
      <TableDataChilds end={true}>
        <div class="flex gap-3 px-1">
          <ButtonIcon
            class="duplicate-icon"
            icon={<CheckIcon />}
            onClick={addMap}
          />
          <ButtonIcon class="close-icon" icon={<CloseIcon />} onClick={close} />
        </div>
      </TableDataChilds>
    </TableRow>
  );
}
