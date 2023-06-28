import { BsInfoCircle } from "solid-icons/bs";

import { useStateGui } from "../../../../../StateGui";
import ButtonGraphicageRightMenu, {
  OffsetType,
} from "../molecule/ButtonGraphicageRightMenu";

const [, { getDisplayedInformationBoard, toggleDisplayedInformationBoard }] =
  useStateGui();

export default function (props: { xOffset: OffsetType }) {
  return (
    <ButtonGraphicageRightMenu
      onClick={toggleDisplayedInformationBoard}
      tooltip="Afficher le panneau d'information"
      icon={<BsInfoCircle class="h-10 w-10" />}
      isActive={getDisplayedInformationBoard()}
      // xOffset="left"
      xOffset={props.xOffset}
    />
  );
}
