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
          transporterItem={props.transporterItem}
          toggleFunction={() => setIsInEditMode(!isInEditMode())}
        />
      }
    >
      <td colspan={4}>
        <TransporterEditMenu
          toggleFunction={() => setIsInEditMode(!isInEditMode())}
          transporterItem={props.transporterItem}
        />
      </td>
    </Show>
  );
}
