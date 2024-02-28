import { Show } from "solid-js";
import { useStateGui } from "../../../../../StateGui";
import { MapType } from "../../../../../_entities/map.entity";
import { TableDataChilds } from "../../../../../component/table/molecule/TableDataChilds";
import CheckIcon from "../../../../../icons/CheckIcon";
import { DuplicateIcon } from "../../../../../icons/DuplicateIcon";
import PencilIcon from "../../../../../icons/PencilIcon";
import TrashIcon from "../../../../../icons/TrashIcon";
import { setInDucplication } from "../../../../../utils/duplicate.utils";
import ButtonIcon from "../../../board/component/molecule/ButtonIcon";
import { CarteToDeleteType } from "../../Maps";

interface MapTableItemActionsProps {
  map: MapType;
  inEditMode: boolean;
  editMap: () => void;
  handleClickDelete: (mapToDelete: CarteToDeleteType) => void;
}

const [, { getActiveMapId }] = useStateGui();

export function MapTableItemActions(props: MapTableItemActionsProps) {
  return (
    <TableDataChilds end={true} class="pr-2">
      <ButtonIcon
        class="close-icon"
        icon={<DuplicateIcon />}
        disable={props.map.id != getActiveMapId()}
        onClick={() => setInDucplication(true)}
      />
      <Show
        when={!props.inEditMode}
        fallback={
          <ButtonIcon
            class="check-icon"
            icon={<CheckIcon />}
            onClick={props.editMap}
          />
        }
      >
        <ButtonIcon
          class="pencil-icon"
          icon={<PencilIcon />}
          onClick={props.editMap}
        />
      </Show>
      <ButtonIcon
        icon={<TrashIcon />}
        onClick={() =>
          props.handleClickDelete({
            id: props.map.id,
            title: props.map.name,
          })
        }
      />
    </TableDataChilds>
  );
}
