import { mergeProps } from "solid-js";

import { OffsetType } from "../molecule/ButtonGraphicageRightMenu";
import ClearButton from "./ClearButton";
import ExportButton from "./ExportButton";
import GenerateButton from "./GenerateButton";
import RemoveLineButton from "./RemoveLineButton";
import "./RightMapMenu.css";

export interface RightMapMenuProps {
  xOffset?: OffsetType;
}

export default function (props: RightMapMenuProps) {
  const mergedProps = mergeProps({ xOffset: "left" as OffsetType }, props);

  return (
    <div id="right-map-menu">
      <RemoveLineButton xOffset={mergedProps.xOffset} />
      <ClearButton xOffset={mergedProps.xOffset} />
      <GenerateButton xOffset={mergedProps.xOffset} />
      <ExportButton xOffset={mergedProps.xOffset} />
    </div>
  );
}
