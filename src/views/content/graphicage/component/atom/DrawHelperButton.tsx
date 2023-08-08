import { FaSolidWandMagicSparkles } from "solid-icons/fa";
import { useStateAction } from "../../../../../StateAction";

import {
  DrawHelperDataType,
  GraphicageService,
} from "../../../../../_services/graphicage.service";

const [, { setPointsToLineUnderConstruction }] = useStateAction();

import { LeafletSchoolType, getLeafletSchools } from "../organism/SchoolPoints";
import {
  LeafletStopType,
  getLeafletStops,
  leafletStopsFilter,
} from "../organism/StopPoints";
import "./DrawHelperButton.css";

interface DrawHelperButtonProps {
  schools: LeafletSchoolType[] | undefined;
}

const [, { getLineUnderConstruction }] = useStateAction();

export function DrawHelperButton(props: DrawHelperButtonProps) {
  async function onclick() {
    const schools: LeafletSchoolType[] =
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

    const formattedResponse: (LeafletStopType | LeafletSchoolType)[] =
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
  data: { id: number; leafletId: number; nature: string }[]
): (LeafletStopType | LeafletSchoolType)[] {
  const points = [...getLeafletSchools(), ...getLeafletStops()];

  const leafletIds: number[] = data.map((item) => item.leafletId);

  return points.filter((item) => leafletIds.includes(item.leafletId));
}
