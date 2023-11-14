import "./CellItem.css";

interface CellItemProps {
  isWeekend: boolean;
  isActive: boolean;
  outPeriod?: boolean;
  isVacation?: boolean;
  isPublicHoliday?: boolean;
  onClick: () => void;
}

export default function (props: CellItemProps) {
  return (
    <div
      classList={{
        "weekend-cell": props.isWeekend,
        "active-cell": props.isActive,
        "outperiod-cell": props.outPeriod,
        "vacation-cell": props.isVacation,
        "public-holiday-cell": props.isPublicHoliday,
      }}
      class="cell-item"
      onClick={props.onClick}
    />
  );
}
