import { Show } from "solid-js";
import { useStateAction } from "../../../../../StateAction";

import {
  DrawHelperDataType,
  GraphicageService,
} from "../../../../../_services/graphicage.service";

const [, { setPointsToLineUnderConstruction }] = useStateAction();

import { FaSolidWandMagicSparkles } from "solid-icons/fa";
import { openDrawHelperDialog } from "../../../../../signaux";
import DrawHelperDialog from "../molecule/DrawHelperDialog";
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
async function drawHelper(data: DrawHelperDataType) {
  console.log("Query", data);
  const response = await GraphicageService.drawHelper(data);
  console.log("response", response);

  const formattedResponse: (LeafletStopType | LeafletSchoolType)[] =
    formatTimeLinePoints(response);
  setPointsToLineUnderConstruction(formattedResponse);
}
export function DrawHelperButton(props: DrawHelperButtonProps) {
  async function requestCircuit(capacity = 30) {
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
      capacity: capacity,
    };

    await drawHelper(data);
  }

  async function onclick() {
    openDrawHelperDialog();
  }

  return (
    <>
      <DrawHelperDialog requestCircuit={requestCircuit} />
      <div class="graphicage-draw-helper-button">
        <Show
          when={getLineUnderConstruction().stops.length > 0}
          fallback={<span>Création d'une ligne</span>}
        >
          <p>Création automatique d'une ligne</p>
          <button onClick={onclick}>
            <FaSolidWandMagicSparkles />
          </button>
        </Show>
      </div>
    </>
  );
}

function formatTimeLinePoints(
  data: { id: number; leafletId: number; nature: string }[]
): (LeafletStopType | LeafletSchoolType)[] {
  const points = [...getLeafletSchools(), ...getLeafletStops()];

  const leafletIds: number[] = data.map((item) => item.leafletId);

  return points.filter((item) => leafletIds.includes(item.leafletId));
}
