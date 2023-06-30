import { mergeProps, splitProps } from "solid-js";

import { OffsetType } from "../molecule/ButtonGraphicageRightMenu";

import AddLineButton from "./AddLineButton";
import ClearButton from "./ClearButton";
import ExportButton from "./ExportButton";
import GenerateButton from "./GenerateButton";
import InformationBoardButton from "./InformationBoardButton";
import RemoveLineButton from "./RemoveLineButton";

// import { useStateAction } from "../../../../../StateAction";

// import { exportButtonHandleClick } from "../../utils";

import "./RightMapMenu.css";

// const [, { getDisplayedInformationBoard, toggleDisplayedInformationBoard }] =
//   useStateGui();

// const [, { isInRemoveLineMode }] = useStateAction();

export interface RightMapMenuProps {
  // toggleDisplayedInformationBoard?: () => void;
  // getDisplayedInformationBoard?: () => boolean;

  // addLineButtonHandleClick?: () => void;
  // isInAddLineMode?: () => boolean;

  // removeLineButtonHandleClick?: () => void;
  // isInRemoveLineMode?: () => boolean;

  // clearButtonHandleClick?: () => void;

  // generateButtonHandleClick?: () => void;

  // exportButtonHandleClick?: () => void;

  xOffset?: OffsetType;
}

export default function (props: RightMapMenuProps) {
  const mergedProps = mergeProps(
    {
      // toggleDisplayedInformationBoard,
      // getDisplayedInformationBoard,

      // addLineButtonHandleClick,
      // isInAddLineMode,

      // removeLineButtonHandleClick,
      // isInRemoveLineMode,

      // clearButtonHandleClick,

      // generateButtonHandleClick,

      // exportButtonHandleClick,

      xOffset: "left" as OffsetType,
    },
    props
  );

  const [local] = splitProps(mergedProps, [
    // "toggleDisplayedInformationBoard",
    // "getDisplayedInformationBoard",
    // "addLineButtonHandleClick",
    // "isInAddLineMode",
    // "removeLineButtonHandleClick",
    // "isInRemoveLineMode",
    // "clearButtonHandleClick",
    // "generateButtonHandleClick",
    // "exportButtonHandleClick",
    "xOffset",
  ]);

  // const [localAddLineButton] = splitProps(mergedProps, [
  //   "addLineButtonHandleClick",
  // ]);

  return (
    <div id="control-map-menu">
      <InformationBoardButton
        xOffset={local.xOffset}
        // toggleDisplayedInformationBoard={local.toggleDisplayedInformationBoard}
        // getDisplayedInformationBoard={local.getDisplayedInformationBoard}
      />
      <AddLineButton
        xOffset={local.xOffset}
        // handleClick={local.addLineButtonHandleClick}
        // isInAddLineMode={local.isInAddLineMode}
      />
      <RemoveLineButton
        xOffset={local.xOffset}
        // handleClick={local.removeLineButtonHandleClick}
        // isInRemoveLineMode={local.isInRemoveLineMode}
      />
      <ClearButton
        xOffset={local.xOffset}
        // handleClick={local.clearButtonHandleClick}
      />
      <GenerateButton
        xOffset={local.xOffset}
        // handleClick={local.generateButtonHandleClick}
      />
      <ExportButton
        xOffset={mergedProps.xOffset}
        // handleClick={local.exportButtonHandleClick}
      />
    </div>
  );
}
