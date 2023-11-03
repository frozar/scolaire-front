import "./CellItem.css";

interface CellItemProps {
  isWeekend: boolean;
  isActive: boolean;
  onClick: () => void;
}

export default function (props: CellItemProps) {
  return (
    <div
      classList={{
        "weekend-cell": props.isWeekend,
        "active-cell": props.isActive,
      }}
      class="cell-item"
      onClick={props.onClick}
    />
  );
}
