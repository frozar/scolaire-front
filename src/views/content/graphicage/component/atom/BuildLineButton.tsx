import { FaSolidWandMagicSparkles } from "solid-icons/fa";
import "./BuildLineButton.css";

interface SelectedEtablissementProps {
  clickHandler: () => void;
  disabled?: boolean;
}

export default function (props: SelectedEtablissementProps) {
  const buildLineClickHandler = () => props.clickHandler();
  return (
    <button
      class="build-line-button"
      onClick={buildLineClickHandler}
      disabled={props.disabled}
    >
      <FaSolidWandMagicSparkles />
    </button>
  );
}
