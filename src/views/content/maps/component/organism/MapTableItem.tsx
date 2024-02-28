import { createSignal } from "solid-js";
import { MapType } from "../../../../../_entities/map.entity";
import { TableData } from "../../../../../component/table/atom/TableData";
import { TableRow } from "../../../../../component/table/molecule/TableRow";
import { MapsUtils } from "../../../../../utils/maps.utils";
import { CarteToDeleteType } from "../../Maps";
import { MapNameDisplay } from "../molecule/MapNameDisplay";
import { MapTableItemActions } from "../molecule/MapTableItemActions";

import "./MapTableItem.css";

interface MapTableItemProps {
  map: MapType;
  handleClickDelete: (mapToDelete: CarteToDeleteType) => void;
}

export function MapTableItem(props: MapTableItemProps) {
  // eslint-disable-next-line solid/reactivity
  const [mapName, setMapName] = createSignal<string>(props.map.name);
  const [inEditMode, setInEditMode] = createSignal(false);

  async function editMap() {
    if (inEditMode())
      await MapsUtils.updateMap({ ...props.map, name: mapName() });
    setInEditMode((prev) => !prev);
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
      class="map-row-item"
    >
      <MapNameDisplay
        onInput={updateName}
        inEditMode={inEditMode()}
        mapName={mapName}
        name={props.map.name}
      />

      <TableData
        class="select-none"
        text={props.map.createAt.toLocaleDateString("fr-FR")}
        end={false}
      />

      <MapTableItemActions
        editMap={editMap}
        inEditMode={inEditMode()}
        handleClickDelete={props.handleClickDelete}
        map={props.map}
      />
    </TableRow>
  );
}
