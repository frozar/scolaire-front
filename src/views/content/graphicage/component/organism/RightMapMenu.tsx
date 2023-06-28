import { mergeProps } from "solid-js";
import { OffsetType } from "../molecule/ButtonGraphicageRightMenu";
import AddLineButton from "./AddLineButton";
import ClearButton from "./ClearButton";
import InformationBoardButton from "./InformationBoardButton";
import RemoveLineButton from "./RemoveLineButton";
import "./RightMapMenu.css";

export interface RightMapMenuProps {
  xOffset?: OffsetType;
}

export default function (props: RightMapMenuProps) {
  const mergedProps = mergeProps({ xOffset: "left" as OffsetType }, props);

  return (
    <div id="control-map-menu">
      <InformationBoardButton xOffset={mergedProps.xOffset} />
      <AddLineButton xOffset={mergedProps.xOffset} />
      <RemoveLineButton xOffset="right" />
      <ClearButton xOffset="right" />
      {/* <GenerateButton xOffset="right" />
      <ExportButton xOffset="right" /> */}
    </div>
  );
}
