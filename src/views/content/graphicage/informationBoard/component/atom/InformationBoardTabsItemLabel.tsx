import "./InformationBoardTabsItemLabel.css";

export interface InformationBoardTabsItemLabelProps {
  isActive: boolean;
  label: string;
}

export default function (props: InformationBoardTabsItemLabelProps) {
  return (
    <span
      class="information-board-tabs-item-label"
      classList={{
        active: props.isActive,
      }}
    >
      {props.label}
    </span>
  );
}
