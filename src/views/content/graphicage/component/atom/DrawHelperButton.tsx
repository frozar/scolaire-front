import { FaSolidWandMagicSparkles } from "solid-icons/fa";
import { useStateAction } from "../../../../../StateAction";
import { PointInformation } from "./Point";

import {
  DrawHelperDataType,
  GraphicageService,
} from "../../../../../_services/graphicage.service";
import { ramassageFilter } from "../organism/PointsRamassage";
import "./DrawHelperButton.css";

interface DrawHelperButtonProps {
  //TODO Must impose PointRamassageType[] type
  schools: PointInformation[] | undefined;
}

const [, { getLineUnderConstruction }] = useStateAction();

export function DrawHelperButton(props: DrawHelperButtonProps) {
  function onclick() {
    const schools: PointInformation[] =
      props.schools != undefined
        ? JSON.parse(JSON.stringify(props.schools))
        : [];

    const selectedStops = JSON.parse(
      JSON.stringify(getLineUnderConstruction().stops)
    );

    const stops = ramassageFilter();

    const data: DrawHelperDataType = {
      schools: schools,
      selected: selectedStops,
      stops: stops,
    };

    GraphicageService.drawHelper(data);
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
