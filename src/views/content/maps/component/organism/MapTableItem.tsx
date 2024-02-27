import { Show, createSignal } from "solid-js";
import { MapType } from "../../../../../_entities/map.entity";
import { TableData } from "../../../../../component/table/atom/TableData";
import { TableDataChilds } from "../../../../../component/table/molecule/TableDataChilds";
import { TableRow } from "../../../../../component/table/molecule/TableRow";
import CheckIcon from "../../../../../icons/CheckIcon";
import { DuplicateIcon } from "../../../../../icons/DuplicateIcon";
import PencilIcon from "../../../../../icons/PencilIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import { DuplicateUtils } from "../../../../../utils/duplicate.utils";
import { MapsUtils } from "../../../../../utils/maps.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { CarteToDeleteType } from "../../Maps";
import { MapNameDisplay } from "../molecule/MapNameDisplay";

import "./MapTableItem.css";

interface MapTableItemProps {
  map: MapType;
  handleClickDelete: (mapToDelete: CarteToDeleteType) => void;
}

export function MapTableItem(props: MapTableItemProps) {
  // eslint-disable-next-line solid/reactivity
  const [mapName, setMapName] = createSignal<string>(props.map.name);
  const [inEditMode, setInEditMode] = createSignal(false);

  function duplicateMap() {
    DuplicateUtils.duplicate();
  }

  async function editMap() {
    if (inEditMode())
      await MapsUtils.updateMap({ ...props.map, name: mapName() });
    setInEditMode((prev) => !prev);
  }

  function deleteMap() {
    props.handleClickDelete({
      id: props.map.id,
      title: props.map.name,
    });
  }

  function onDblClick() {
    MapsUtils.setActiveMap(props.map.id);
  }

  function updateName(value: string) {
    setMapName(value);
  }

  return (
    <TableRow
      active={props.map.isActive()}
      onDBClick={onDblClick}
      class="cursor-pointer"
    >
      <MapNameDisplay
        onInput={updateName}
        inEditMode={inEditMode()}
        mapName={mapName}
        name={props.map.name}
      />

      <TableData
        text={props.map.createAt.toLocaleDateString("fr-FR")}
        end={false}
      />
      <TableDataChilds end={true}>
        <ButtonIcon
          class="duplicate-icon"
          icon={<DuplicateIcon />}
          onClick={duplicateMap}
        />
        <Show
          when={!inEditMode()}
          fallback={
            <ButtonIcon
              class="duplicate-icon"
              icon={<CheckIcon />}
              onClick={editMap}
            />
          }
        >
          <ButtonIcon icon={<PencilIcon />} onClick={editMap} />
        </Show>
        <ButtonIcon icon={<TrashIcon />} onClick={deleteMap} />
      </TableDataChilds>
    </TableRow>
  );
}
