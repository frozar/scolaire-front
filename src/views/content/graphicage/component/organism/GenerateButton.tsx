import { FiArrowUpCircle } from "solid-icons/fi";

import { splitProps } from "solid-js";

import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

export interface GenerateButtonProps {
  handleClick: () => void;
  xOffset: OffsetType;
}

export default function (props: GenerateButtonProps) {
  // const mergedProps = mergeProps({ xOffset: "left" as OffsetType }, props);

  // const xOffset = () => mergedProps.xOffset;

  // const handleClick = () => {
  //   defineModalToOpen(openGeneratorDialogBox);
  //   confirmAbortEditionNeedToBeCall();
  // };

  const [local] = splitProps(props, ["handleClick", "xOffset"]);

  return (
    <ButtonGraphicageRightMenu
      onClick={local.handleClick}
      tooltip="Générer des trajets"
      icon={<FiArrowUpCircle class="h-10 w-10" />}
      xOffset={local.xOffset}
    />
  );
}
