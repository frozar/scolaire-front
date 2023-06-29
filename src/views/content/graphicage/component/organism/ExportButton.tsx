import { CgExport } from "solid-icons/cg";

import { openExportConfirmationBox } from "../../../../../signaux";
import {
  confirmAbortEditionNeedToBeCall,
  defineModalToOpen,
} from "../../ConfirmStopAddLineBox";

import { mergeProps } from "solid-js";
import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

export interface ExportButtonProps {
  xOffset?: OffsetType;
}

export default function (props: ExportButtonProps) {
  const mergedProps = mergeProps({ xOffset: "left" as OffsetType }, props);

  const xOffset = () => mergedProps.xOffset;

  const handleClick = () => {
    defineModalToOpen(openExportConfirmationBox);
    confirmAbortEditionNeedToBeCall();
  };

  return (
    <ButtonGraphicageRightMenu
      onClick={handleClick}
      icon={<CgExport class="h-10 w-10 pb-[5px]" />}
      tooltip="Exporter"
      xOffset={xOffset()}
    />
  );
}
