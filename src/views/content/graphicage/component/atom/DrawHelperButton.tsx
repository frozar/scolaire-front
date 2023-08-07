import { FaSolidWandMagicSparkles } from "solid-icons/fa";
import { useStateAction } from "../../../../../StateAction";
import { PointIdentityType, PointInformation } from "./Point";

import {
  DrawHelperDataType,
  GraphicageService,
} from "../../../../../_services/graphicage.service";

const [, { setPointsToLineUnderConstruction }] = useStateAction();

import { NatureEnum } from "../../../../../type";
import { leafletStopsFilter } from "../organism/PointsRamassage";
import "./DrawHelperButton.css";

interface DrawHelperButtonProps {
  //TODO Must impose PointRamassageType[] type
  schools: PointInformation[] | undefined;
}

const [, { getLineUnderConstruction }] = useStateAction();

export function DrawHelperButton(props: DrawHelperButtonProps) {
  async function onclick() {
    const schools: PointInformation[] =
      props.schools != undefined
        ? JSON.parse(JSON.stringify(props.schools))
        : [];

    const selectedStops = JSON.parse(
      JSON.stringify(getLineUnderConstruction().stops)
    );

    const stops = leafletStopsFilter();

    const data: DrawHelperDataType = {
      schools: schools,
      selected: selectedStops,
      stops: stops,
    };

    console.log("Query", data);

    const response = await GraphicageService.drawHelper(data);
    console.log("response", response);

    const formattedResponse: PointIdentityType[] =
      formatTimeLinePoints(response);
    setPointsToLineUnderConstruction(formattedResponse);
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
