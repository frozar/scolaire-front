import { useStateGui } from "../../../../StateGui";
import "./LayerChoiceMenu.css";
import CloseButton from "../../../../component/atom/CloseButton";

const [, { toggleDisplayedLayerChoiceMenu, getDisplayedLayerChoiceMenu }] =
  useStateGui();

export default function () {
  return (
    <section
      id="layer-choice-menu"
      classList={{ active: getDisplayedLayerChoiceMenu() }}
    >
      <header>
        <CloseButton onClick={toggleDisplayedLayerChoiceMenu} />
        <h2>Choix du fond de carte</h2>
      </header>
    </section>
  );
}
