import { For } from "solid-js";
import { useStateGui } from "../../../../../StateGui";
import { TableHeaderCol } from "../../../../../component/table/atom/TableHeaderCol";
import { TableContent } from "../../../../../component/table/molecule/TableContent";
import { TableHeader } from "../../../../../component/table/molecule/TableHeader";
import { Table } from "../../../../../component/table/organism/Table";
import { UserMapType } from "../../../../../type";
import { CarteToDeleteType } from "../../Maps";
import { MapTableItem } from "./MapTableItem";

const [, { setActiveMapId }] = useStateGui();

interface MapTablesProps {
  mapList: UserMapType[];
  handleClickDelete: (mapToDelete: CarteToDeleteType) => void;
}

export function MapTables(props: MapTablesProps) {
  function setActiveMap(mapId: number) {
    props.mapList.map((map) => map.setIsActive(map.id === mapId));
    setActiveMapId(mapId);
  }

  return (
    <Table>
      <TableHeader>
        <TableHeaderCol text="Nom" end={false} />
        <TableHeaderCol text="Date de création" end={false} />
        <TableHeaderCol text="Actions" end={true} />
      </TableHeader>

      <TableContent>
        <For each={props.mapList}>
          {(map) => (
            <MapTableItem
              handleClickDelete={props.handleClickDelete}
              setActiveMap={setActiveMap}
              map={map}
            />
          )}
        </For>
      </TableContent>
    </Table>
  );
}
