import { TableData } from "../../../../../component/table/atom/TableData";
import { TableDataChilds } from "../../../../../component/table/molecule/TableDataChilds";
import { TableRow } from "../../../../../component/table/molecule/TableRow";
import { DuplicateIcon } from "../../../../../icons/DuplicateIcon";
import PencilIcon from "../../../../../icons/PencilIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import { UserMapType } from "../../../../../type";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { CarteToDeleteType } from "../../Maps";

import "./MapTableItem.css";

interface MapTableItemProps {
  map: UserMapType;
  setActiveMap: (mapId: number) => void;
  handleClickDelete: (mapToDelete: CarteToDeleteType) => void;
}

export function MapTableItem(props: MapTableItemProps) {
  function duplicateMap() {
    console.log("ok");
  }
  function editMap() {
    console.log("ok");
  }
  function deleteMap() {
    props.handleClickDelete({
      id: props.map.id,
      title: props.map.name,
    });
  }

  function onDblClick() {
    props.setActiveMap(props.map.id);
  }

  return (
    <TableRow active={props.map.isActive()} onDBClick={onDblClick}>
      <TableData text={props.map.name} end={false} />
      <TableData text="- todo -" end={false} />
      <TableDataChilds end={true}>
        <ButtonIcon
          class="duplicate-icon"
          icon={<DuplicateIcon />}
          onClick={duplicateMap}
        />
        <ButtonIcon icon={<PencilIcon />} onClick={editMap} />
        <ButtonIcon icon={<TrashIcon />} onClick={deleteMap} />
      </TableDataChilds>
    </TableRow>
  );
}
