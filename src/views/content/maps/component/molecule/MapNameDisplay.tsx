import { Accessor, Show } from "solid-js";
import { TextInput } from "../../../../../component/atom/TextInput";
import { TableData } from "../../../../../component/table/atom/TableData";
import { TableDataChilds } from "../../../../../component/table/molecule/TableDataChilds";

interface MapNameDisplayProps {
  mapName: Accessor<string>;
  name: string;
  inEditMode: boolean;
  onInput: (value: string) => void;
}

export function MapNameDisplay(props: MapNameDisplayProps) {
  return (
    <Show
      when={props.inEditMode}
      fallback={<TableData text={props.name} end={false} />}
    >
      <TableDataChilds>
        <TextInput defaultValue={props.mapName()} onInput={props.onInput} />
      </TableDataChilds>
    </Show>
  );
}
