import { CgExport } from "solid-icons/cg";

import { splitProps } from "solid-js";

import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

export interface ExportButtonProps {
  handleClick: () => void;
  xOffset: OffsetType;
}

export default function (props: ExportButtonProps) {
  // const mergedProps = mergeProps({ xOffset: "left" as OffsetType }, props);

  // const xOffset = () => mergedProps.xOffset;

  // const handleClick = () => {
  //   defineModalToOpen(openExportConfirmationBox);
  //   confirmAbortEditionNeedToBeCall();
  // };
  const [local] = splitProps(props, ["handleClick", "xOffset"]);

  return (
    <ButtonGraphicageRightMenu
      onClick={local.handleClick}
      icon={<CgExport class="h-10 w-10 pb-[5px]" />}
      tooltip="Exporter"
      xOffset={local.xOffset}
    />
  );
}
