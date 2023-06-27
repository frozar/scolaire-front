import { BsInfoCircle } from "solid-icons/bs";

import { useStateGui } from "../../../../../StateGui";
import ButtonGraphicageRightMenu from "../molecule/ButtonGraphicageRightMenu";

const [, { getDisplayedInformationBoard, toggleDisplayedInformationBoard }] =
  useStateGui();

export default function () {
  return (
    <ButtonGraphicageRightMenu
      onClick={toggleDisplayedInformationBoard}
      tooltip="Afficher le panneau d'information"
      icon={<BsInfoCircle class="h-10 w-10" />}
      isActive={getDisplayedInformationBoard()}
    />
  );
}
