import { BsInfoCircle } from "solid-icons/bs";

import { useStateGui } from "../../../../../StateGui";

import { mergeProps } from "solid-js";
import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

const [, { getDisplayedInformationBoard, toggleDisplayedInformationBoard }] =
  useStateGui();

export interface InformationBoardButtonProps {
  // onClick={toggleDisplayedInformationBoard},
  // tooltip="Afficher le panneau d'information",
  // isActive?:,
  xOffset?: OffsetType;
}

// const informationBoardProps = {
//   icon: () => BsInfoCircle({ class: "h-10 w-10" }),
//   onClick: toggleDisplayedInformationBoard,
//   tooltip: "Afficher le panneau d'information",
//   isActive: getDisplayedInformationBoard(),
//   xOffset: "left" as OffsetType,
// };

export default function (props: InformationBoardButtonProps) {
  const mergedProps = mergeProps({ xOffset: "left" as OffsetType }, props);

  const xOffset = () => mergedProps.xOffset;

  return (
    <ButtonGraphicageRightMenu
      icon={<BsInfoCircle class="h-10 w-10" />}
      onClick={toggleDisplayedInformationBoard}
      tooltip="Afficher le panneau d'information"
      isActive={getDisplayedInformationBoard()}
      xOffset={xOffset()}
    />
  );

  // const myProps = () => ({
  //   icon: BsInfoCircle({ class: "h-10 w-10" }),
  //   onClick: toggleDisplayedInformationBoard,
  //   tooltip: "Afficher le panneau d'information",
  //   isActive: getDisplayedInformationBoard(),
  //   xOffset: xOffset(),
  // });

  // return ButtonGraphicageRightMenu(myProps());
  // return ButtonGraphicageRightMenu(informationBoardProps);
  // return <ButtonGraphicageRightMenu {...informationBoardProps} />;
  // return BsInfoCircle({ class: "h-10 w-10" });
}
