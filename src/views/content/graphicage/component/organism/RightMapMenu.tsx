import { mergeProps, splitProps } from "solid-js";

import { OffsetType } from "../molecule/ButtonGraphicageRightMenu";

import AddLineButton from "./AddLineButton";
import ClearButton from "./ClearButton";
import ExportButton from "./ExportButton";
import GenerateButton from "./GenerateButton";
import InformationBoardButton from "./InformationBoardButton";
import RemoveLineButton from "./RemoveLineButton";

import "./RightMapMenu.css";

export interface RightMapMenuProps {
  xOffset?: OffsetType;
}

export default function (props: RightMapMenuProps) {
  const mergedProps = mergeProps({ xOffset: "left" as OffsetType }, props);

  const [local] = splitProps(mergedProps, ["xOffset"]);

  return (
    <div id="right-map-menu">
      <InformationBoardButton xOffset={local.xOffset} />
      <AddLineButton xOffset={local.xOffset} />
      <RemoveLineButton xOffset={local.xOffset} />
      <ClearButton xOffset={local.xOffset} />
      <GenerateButton xOffset={local.xOffset} />
      <ExportButton xOffset={mergedProps.xOffset} />
    </div>
  );
}
