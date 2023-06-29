import { FaSolidPlus } from "solid-icons/fa";

import { splitProps } from "solid-js";

import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

// const [, { setModeAddLine, isInAddLineMode, setModeRead }] = useStateAction();

export interface AddLineButtonProps {
  handleClick: () => void;
  isInAddLineMode: () => boolean;
  xOffset: OffsetType;
}

export default function (props: AddLineButtonProps) {
  // const handleClick = () => {
  //   if (isInAddLineMode()) {
  //     setModeRead();
  //     fetchBusLines();
  //   } else {
  //     deselectAllPoints();
  //     setModeAddLine();
  //     fetchBusLines();
  //     displayAddLineMessage();
  //   }
  // };

  // const mergedProps = mergeProps(
  //   { handleClick, isInAddLineMode, xOffset: "left" as OffsetType },
  //   props
  // );

  const [local] = splitProps(props, [
    "handleClick",
    "isInAddLineMode",
    "xOffset",
  ]);

  return (
    <ButtonGraphicageRightMenu
      onClick={local.handleClick}
      tooltip="Ajouter une ligne"
      isActive={local.isInAddLineMode()}
      icon={<FaSolidPlus class="w-full p-0 h-2/3" />}
      xOffset={local.xOffset}
    />
  );
}
