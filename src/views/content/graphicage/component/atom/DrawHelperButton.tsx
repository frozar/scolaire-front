import { FaSolidWandMagicSparkles } from "solid-icons/fa";
import { useStateAction } from "../../../../../StateAction";
import { PointInformation } from "./Point";

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
      props.schools != undefined ? props.schools.map((school) => school) : [];

    const selectedStops = JSON.parse(
      JSON.stringify(getLineUnderConstruction().stops)
    );

    const stops = ramassageFilter();

    const data = {
      schools: schools,
      selectedStops: selectedStops,
      stops: stops,
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
<<<<<<< HEAD

function formatTimeLinePoints(
  data: { id: number; idPoint: number; nature: string }[]
): PointIdentityType[] {
  return data.map((item) => {
    return {
      id: item.id,
      idPoint: item.idPoint,
      nature:
        item.nature == "stop" ? NatureEnum.ramassage : NatureEnum.etablissement,
    };
  });
}
=======
>>>>>>> d10adeda (Graphicage Draw Helper : refacto the draw helper button)
