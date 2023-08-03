import { FaSolidWandMagicSparkles } from "solid-icons/fa";
import { useStateAction } from "../../../../../StateAction";
import { PointInformation } from "./Point";

import "./DrawHelperButton.css";

interface DrawHelperButtonProps {
  //TODO Must impose PointRamassageType[] type
  schools: PointInformation[] | undefined;
}

const [, { getLineUnderConstruction }] = useStateAction();

export function DrawHelperButton(props: DrawHelperButtonProps) {
  function onclick() {
    const data = {
      schools: JSON.parse(JSON.stringify(props.schools)),
      selectedStops: JSON.parse(
        JSON.stringify(getLineUnderConstruction().stops)
      ),
      stops: JSON.parse(JSON.stringify(getLineUnderConstruction().stops)),
    };

    console.log(data);
  }

  return (
    <div class="graphicage-draw-helper-button">
      <p>Création d'une ligne</p>
      <button onClick={onclick}>
        <FaSolidWandMagicSparkles />
      </button>
    </div>
  );
}
