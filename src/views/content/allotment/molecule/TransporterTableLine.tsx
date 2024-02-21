import { Show, createSignal } from "solid-js";
import { TransporterType } from "../../../../_entities/transporter.entity";
import { TransporterEditMenu } from "./TransporterEditMenu";
import { TransporterTableData } from "./TransporterTableData";

interface TransporterTableLineProps {
  transporterItem: TransporterType;
}

export function TransporterTableLine(props: TransporterTableLineProps) {
  const [isInEditMode, setIsInEditMode] = createSignal(false);

  return (
    <Show
      when={isInEditMode()}
      fallback={
        <TransporterTableData
          name={props.transporterItem.name}
          type={props.transporterItem.type}
          toggleFunction={() => setIsInEditMode(!isInEditMode())}
        />
      }
    >
      <td colspan={4}>
        <TransporterEditMenu
          name={props.transporterItem.name}
          type={props.transporterItem.type}
        />
      </td>
    </Show>
  );
}
