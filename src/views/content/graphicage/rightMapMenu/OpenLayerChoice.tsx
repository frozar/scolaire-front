import { useStateGui } from "../../../../StateGui";
import ButtonGraphicageRightMenu from "../../../../component/atom/ButtonGraphicageRightMenu";
import { VsLayers } from "solid-icons/vs";

const [, { toggleDisplayedLayerChoiceMenu, getDisplayedLayerChoiceMenu }] =
  useStateGui();

export default function () {
  return (
    <ButtonGraphicageRightMenu
      onClick={toggleDisplayedLayerChoiceMenu}
      tooltip="Choix du fond de la carte"
      icon={<VsLayers class="h-10 w-10" />}
      isActive={getDisplayedLayerChoiceMenu()}
    />
  );
}
