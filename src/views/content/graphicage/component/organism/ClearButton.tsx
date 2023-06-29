import { FaRegularTrashCan } from "solid-icons/fa";

import { splitProps } from "solid-js";

import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

export interface ClearButtonProps {
  handleClick: () => void;
  xOffset: OffsetType;
}

export default function (props: ClearButtonProps) {
  // const mergedProps = mergeProps({ xOffset: "left" as OffsetType }, props);

  // const xOffset = () => mergedProps.xOffset;

  // const handleClick = () => {
  //   console.log("no mock");

  //   defineModalToOpen(openClearConfirmationBox);
  //   confirmAbortEditionNeedToBeCall();
  // };

  const [local] = splitProps(props, ["handleClick", "xOffset"]);

  return (
    <ButtonGraphicageRightMenu
      onClick={local.handleClick}
      tooltip="Vider la carte"
      icon={<FaRegularTrashCan class="w-full p-0 h-2/3" />}
      xOffset={local.xOffset}
    />
  );
}
