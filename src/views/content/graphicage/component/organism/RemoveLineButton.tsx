import { FaSolidMinus } from "solid-icons/fa";

import { splitProps } from "solid-js";

import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

// const [, { setModeRemoveLine, isInRemoveLineMode, setModeRead }] =
//   useStateAction();

export interface RemoveLineButtonProps {
  handleClick: () => void;
  isInRemoveLineMode: () => boolean;
  xOffset: OffsetType;
}

export default function (props: RemoveLineButtonProps) {
  // const handleClick = () => {
  //   deselectAllPoints();
  //   if (isInRemoveLineMode()) {
  //     setModeRead();
  //     fetchBusLines();
  //     return;
  //   }
  //   setModeRemoveLine();
  //   fetchBusLines();
  //   displayRemoveLineMessage();
  // };

  // const mergedProps = mergeProps(
  //   { handleClick, isInRemoveLineMode, xOffset: "left" as OffsetType },
  //   props
  // );

  const [local] = splitProps(props, [
    "handleClick",
    "isInRemoveLineMode",
    "xOffset",
  ]);

  return (
    <ButtonGraphicageRightMenu
      onClick={local.handleClick}
      tooltip="Supprimer une ligne"
      icon={<FaSolidMinus class="w-full h-2/3" />}
      isActive={local.isInRemoveLineMode()}
      xOffset={local.xOffset}
    />
  );
}
