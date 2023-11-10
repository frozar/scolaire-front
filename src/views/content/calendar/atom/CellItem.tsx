import "./CellItem.css";

interface CellItemProps {
  isWeekend: boolean;
  isActive: boolean;
  onClick: () => void;
  outPeriod?: boolean;
}

export default function (props: CellItemProps) {
  return (
    <div
      classList={{
        "weekend-cell": props.isWeekend,
        "active-cell": props.isActive,
        "outperiod-cell": props.outPeriod,
      }}
      class="cell-item"
      onClick={props.onClick}
    />
  );
}
