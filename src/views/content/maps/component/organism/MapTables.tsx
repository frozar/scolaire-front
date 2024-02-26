import { For, Show } from "solid-js";
import { userMaps } from "../../../../../_stores/map.store";
import { TableHeaderCol } from "../../../../../component/table/atom/TableHeaderCol";
import { TableContent } from "../../../../../component/table/molecule/TableContent";
import { TableHeader } from "../../../../../component/table/molecule/TableHeader";
import { Table } from "../../../../../component/table/organism/Table";
import { CarteToDeleteType, isDisplayedCreateMap } from "../../Maps";
import { MapTableItem } from "./MapTableItem";
import { MapTableItemAdd } from "./MapTableItemAdd";

interface MapTablesProps {
  handleClickDelete: (mapToDelete: CarteToDeleteType) => void;
}

export function MapTables(props: MapTablesProps) {
  return (
    <Table>
      <TableHeader>
        <TableHeaderCol text="Nom" end={false} />
        <TableHeaderCol text="Date de création" end={false} />
        <TableHeaderCol text="Actions" end={true} />
      </TableHeader>

      <TableContent>
        <For each={userMaps()}>
          {(map) => (
            <MapTableItem
              handleClickDelete={props.handleClickDelete}
              map={map}
            />
          )}
        </For>

        <Show when={isDisplayedCreateMap()}>
          <MapTableItemAdd />
        </Show>
      </TableContent>
    </Table>
  );
}
