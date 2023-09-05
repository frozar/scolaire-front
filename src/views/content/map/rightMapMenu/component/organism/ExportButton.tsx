import { CgExport } from "solid-icons/cg";
import { mergeProps } from "solid-js";
import { openExportConfirmationBox } from "../../../../../../signaux";
import {
  confirmAbortEditionNeedToBeCall,
  defineModalToOpen,
} from "../../../ConfirmStopAddLineBox";
import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

export interface ExportButtonProps {
  handleClick?: () => void;
  xOffset: OffsetType;
}

export default function (props: ExportButtonProps) {
  const handleClick = () => {
    defineModalToOpen(openExportConfirmationBox);
    confirmAbortEditionNeedToBeCall();
  };

  const mergedProps = mergeProps({ handleClick }, props);

  return (
    <ButtonGraphicageRightMenu
      onClick={mergedProps.handleClick}
      icon={<CgExport class="h-10 w-10 pb-[5px]" />}
      tooltip="Exporter"
      xOffset={mergedProps.xOffset}
    />
  );
}
