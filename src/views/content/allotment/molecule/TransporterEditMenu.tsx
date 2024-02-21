import { TransporterEditMenuHeader } from "../atom/TransporterEditMenuHeader";
import { TransporterEditMenuContent } from "./TransporterEditMenuContent";

interface TransporterEditMenuProps {
  name: string;
  type: string;
}

export function TransporterEditMenu(props: TransporterEditMenuProps) {
  return (
    <div>
      <TransporterEditMenuHeader title={props.name} />
      <TransporterEditMenuContent
        name={props.name}
        type={props.type}
        onNameChange={() => console.log()}
        onTypeChange={() => console.log()}
      />
    </div>
  );
}
