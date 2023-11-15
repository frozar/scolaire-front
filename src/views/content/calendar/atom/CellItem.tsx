import "./CellItem.css";

interface CellItemProps {
  isWeekend: boolean;
  isActive: boolean;
  outPeriod?: boolean;
  isVacation?: boolean;
  isPublicHoliday?: boolean;
  onClick: () => void;
  coloredCell?: boolean;
}

export default function (props: CellItemProps) {
  return (
    <div
      classList={{
        "weekend-cell": props.isWeekend,
        "active-cell":
          props.isActive &&
          !props.isVacation &&
          !props.outPeriod &&
          !props.isPublicHoliday,
        "outperiod-cell": props.outPeriod && props.coloredCell,
        "vacation-cell": props.isVacation && props.coloredCell,
        "public-holiday-cell": props.isPublicHoliday && props.coloredCell,
      }}
      class="cell-item"
      onClick={() => props.onClick()}
    />
  );
}
