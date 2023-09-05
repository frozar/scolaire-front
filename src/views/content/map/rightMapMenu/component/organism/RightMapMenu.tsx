import { mergeProps } from "solid-js";

import AddLineButton from "../../../component/organism/AddLineButton";
import ClearButton from "../../../component/organism/ClearButton";
import ExportButton from "../../../component/organism/ExportButton";
import GenerateButton from "../../../component/organism/GenerateButton";
import RemoveLineButton from "../../../component/organism/RemoveLineButton";
import { OffsetType } from "../molecule/ButtonGraphicageRightMenu";
import "./RightMapMenu.css";

export interface RightMapMenuProps {
  xOffset?: OffsetType;
}

export default function (props: RightMapMenuProps) {
  const mergedProps = mergeProps({ xOffset: "left" as OffsetType }, props);

  return (
    <div id="right-map-menu">
      {/* <InformationBoardButton xOffset={mergedProps.xOffset} /> */}
      <AddLineButton xOffset={mergedProps.xOffset} />
      <RemoveLineButton xOffset={mergedProps.xOffset} />
      <ClearButton xOffset={mergedProps.xOffset} />
      <GenerateButton xOffset={mergedProps.xOffset} />
      <ExportButton xOffset={mergedProps.xOffset} />
    </div>
  );
}
