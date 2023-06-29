import { BsInfoCircle } from "solid-icons/bs";

import { splitProps } from "solid-js";
import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

// const [, { getDisplayedInformationBoard, toggleDisplayedInformationBoard }] =
//   useStateGui();

export interface InformationBoardButtonProps {
  // onClick={toggleDisplayedInformationBoard},
  toggleDisplayedInformationBoard: () => void;
  // tooltip="Afficher le panneau d'information",
  // isActive?:,
  getDisplayedInformationBoard: () => boolean;
  xOffset: OffsetType;
}

// const informationBoardProps = {
//   icon: () => BsInfoCircle({ class: "h-10 w-10" }),
//   onClick: toggleDisplayedInformationBoard,
//   tooltip: "Afficher le panneau d'information",
//   isActive: getDisplayedInformationBoard(),
//   xOffset: "left" as OffsetType,
// };

export default function (props: InformationBoardButtonProps) {
  // const mergedProps = mergeProps(
  //   {
  //     toggleDisplayedInformationBoard,
  //     getDisplayedInformationBoard,
  //     xOffset: "left" as OffsetType,
  //   },
  //   props
  // );

  // const [local] = splitProps(mergedProps, [
  //   "toggleDisplayedInformationBoard",
  //   "getDisplayedInformationBoard",
  //   "xOffset",
  // ]);
  const [local] = splitProps(props, [
    "toggleDisplayedInformationBoard",
    "getDisplayedInformationBoard",
    "xOffset",
  ]);

  return (
    <ButtonGraphicageRightMenu
      icon={<BsInfoCircle class="h-10 w-10" />}
      onClick={local.toggleDisplayedInformationBoard}
      tooltip="Afficher le panneau d'information"
      isActive={local.getDisplayedInformationBoard()}
      xOffset={local.xOffset}
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
