import { Show, createSignal } from "solid-js";
import { TransporterEditMenu } from "./TransporterEditMenu";
import { TransporterTableData } from "./TransporterTableData";

interface AllotmentEditSubMenuItemProps {
  name: string;
  type: string;
}

export function TransporterTableLine(props: AllotmentEditSubMenuItemProps) {
  const [isInEditMode, setIsInEditMode] = createSignal(false);

  return (
    <Show
      when={isInEditMode()}
      fallback={
        <TransporterTableData
          name={props.name}
          type={props.type}
          toggleFunction={() => setIsInEditMode(!isInEditMode())}
        />
      }
    >
      <td colspan={4}>
        <TransporterEditMenu name={props.name} type={props.type} />
      </td>
    </Show>
  );
}
