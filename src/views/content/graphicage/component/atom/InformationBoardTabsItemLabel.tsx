import "./InformationBoardTabsItemLabel.css";

export interface InformationBoardTabsItemLabelProps {
  label: string;
  isActive: boolean;
}

export function InformationBoardTabsItemLabel(
  props: InformationBoardTabsItemLabelProps
) {
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
