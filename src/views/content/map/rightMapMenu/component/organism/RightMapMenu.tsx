import { mergeProps } from "solid-js";

import { OffsetType } from "../molecule/ButtonGraphicageRightMenu";
import ExportButton from "./ExportButton";
import GenerateButton from "./GenerateButton";
import "./RightMapMenu.css";

export interface RightMapMenuProps {
  xOffset?: OffsetType;
}

export default function (props: RightMapMenuProps) {
  const mergedProps = mergeProps({ xOffset: "left" as OffsetType }, props);

  return (
    <div id="right-map-menu">
      <GenerateButton xOffset={mergedProps.xOffset} />
      <ExportButton xOffset={mergedProps.xOffset} />
    </div>
  );
}
