import { mergeProps, splitProps } from "solid-js";

import { OffsetType } from "../molecule/ButtonGraphicageRightMenu";

import AddLineButton from "./AddLineButton";
import ClearButton from "./ClearButton";
import ExportButton from "./ExportButton";
import GenerateButton from "./GenerateButton";
import InformationBoardButton from "./InformationBoardButton";
import RemoveLineButton from "./RemoveLineButton";

import { useStateGui } from "../../../../../StateGui";

import "./RightMapMenu.css";

const [, { getDisplayedInformationBoard, toggleDisplayedInformationBoard }] =
  useStateGui();

export interface RightMapMenuProps {
  toggleDisplayedInformationBoard?: () => void;
  getDisplayedInformationBoard?: () => boolean;
  xOffset?: OffsetType;
}

export default function (props: RightMapMenuProps) {
  const mergedProps = mergeProps(
    {
      toggleDisplayedInformationBoard,
      getDisplayedInformationBoard,
      xOffset: "left" as OffsetType,
    },
    props
  );

  const [local] = splitProps(mergedProps, [
    "toggleDisplayedInformationBoard",
    "getDisplayedInformationBoard",
    "xOffset",
  ]);

  return (
    <div id="control-map-menu">
      <InformationBoardButton
        xOffset={local.xOffset}
        toggleDisplayedInformationBoard={local.toggleDisplayedInformationBoard}
        getDisplayedInformationBoard={local.getDisplayedInformationBoard}
      />
      <AddLineButton xOffset={mergedProps.xOffset} />
      <RemoveLineButton xOffset={mergedProps.xOffset} />
      <ClearButton xOffset={mergedProps.xOffset} />
      <GenerateButton xOffset={mergedProps.xOffset} />
      <ExportButton xOffset={mergedProps.xOffset} />
    </div>
  );
}
