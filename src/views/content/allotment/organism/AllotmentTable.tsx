import { For, Setter } from "solid-js";
import { AllotmentType } from "../../../../_entities/allotment.entity";
import { TableContent } from "../../../../component/table/molecule/TableContent";
import { Table } from "../../../../component/table/organism/Table";
import { setIsAllotmentEdited } from "../../market/molecule/allotment/AllotmentTab";
import { AllotmentTableHeader } from "../molecule/AllotmentTableHeader";
import { AllotmentTableLine } from "../molecule/AllotmentTableLine";

interface AllotmentTableProps {
  allotments: AllotmentType[];
  allotmentsSetter: Setter<AllotmentType[]>;
}

export function AllotmentTable(props: AllotmentTableProps) {
  function editAllotmentList(allotment: AllotmentType) {
    props.allotmentsSetter((prev) => {
      return prev.map((item) => {
        if (item.id == allotment.id) {
          if (item != allotment) setIsAllotmentEdited(true);
          return allotment;
        }
        return item;
      });
    });
  }

  function removeFromAllotmentList(id: number) {
    props.allotmentsSetter((prev) => {
      return prev.filter((item) => item.id != id);
    });
  }

  return (
    <Table>
      <AllotmentTableHeader />
      <TableContent>
        <For each={props.allotments}>
          {(allotment: AllotmentType) => (
            <AllotmentTableLine
              deleteListItem={removeFromAllotmentList}
              editListItem={editAllotmentList}
              allotmentItem={allotment}
            />
          )}
        </For>
      </TableContent>
    </Table>
  );
}
