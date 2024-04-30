import { For, Setter } from "solid-js";
import { AllotmentType } from "../../../../_stores/allotment.store";
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
        if (item.id == allotment.id) return allotment;
        return item;
      });
    });
    setIsAllotmentEdited(true);
  }

  return (
    <Table>
      <AllotmentTableHeader />
      <TableContent>
        <For each={props.allotments}>
          {(allotment: AllotmentType) => (
            <AllotmentTableLine
              editList={editAllotmentList}
              allotmentItem={allotment}
            />
          )}
        </For>
      </TableContent>
    </Table>
  );
}
