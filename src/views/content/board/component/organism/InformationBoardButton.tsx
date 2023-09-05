import { mergeProps } from "solid-js";

import { useStateGui } from "../../../../../StateGui";

import { BsInfoCircle } from "solid-icons/bs";
import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../../../map/rightMapMenu/component/molecule/ButtonGraphicageRightMenu";

const [, { getDisplayedInformationBoard, toggleDisplayedInformationBoard }] =
  useStateGui();

export interface InformationBoardButtonProps {
  toggleDisplayedInformationBoard?: () => void;
  getDisplayedInformationBoard?: () => boolean;
  xOffset: OffsetType;
}

export default function (props: InformationBoardButtonProps) {
  const mergedProps = mergeProps(
    {
      toggleDisplayedInformationBoard,
      getDisplayedInformationBoard,
    },
    props
  );

  return (
    <ButtonGraphicageRightMenu
      icon={<BsInfoCircle class="h-10 w-10" />}
      onClick={mergedProps.toggleDisplayedInformationBoard}
      tooltip="Afficher le panneau d'information"
      isActive={mergedProps.getDisplayedInformationBoard()}
      xOffset={mergedProps.xOffset}
    />
  );
}
