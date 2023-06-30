import { CgExport } from "solid-icons/cg";

import { mergeProps, splitProps } from "solid-js";

import { openExportConfirmationBox } from "../../../../../signaux";
import {
  confirmAbortEditionNeedToBeCall,
  defineModalToOpen,
} from "../../ConfirmStopAddLineBox";
import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

export interface ExportButtonProps {
  handleClick?: () => void;
  xOffset: OffsetType;
}

export default function (props: ExportButtonProps) {
  // const xOffset = () => mergedProps.xOffset;

  const handleClick = () => {
    defineModalToOpen(openExportConfirmationBox);
    confirmAbortEditionNeedToBeCall();
  };

  const mergedProps = mergeProps(
    { handleClick }, //, xOffset: "left" as OffsetType
    props
  );
  const [local] = splitProps(mergedProps, ["handleClick", "xOffset"]);

  return (
    <ButtonGraphicageRightMenu
      onClick={local.handleClick}
      icon={<CgExport class="h-10 w-10 pb-[5px]" />}
      tooltip="Exporter"
      xOffset={local.xOffset}
    />
  );
}
