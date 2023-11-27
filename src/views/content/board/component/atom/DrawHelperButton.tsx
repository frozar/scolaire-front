import { Show } from "solid-js";

import {
  DrawHelperDataType,
  GraphicageService,
} from "../../../../../_services/graphicage.service";

import { FaSolidWandMagicSparkles } from "solid-icons/fa";
import { SchoolType } from "../../../../../_entities/school.entity";
import {
  disableSpinningWheel,
  enableSpinningWheel,
} from "../../../../../signaux";
import DrawHelperDialog, {
  openDrawHelperDialog,
} from "../molecule/DrawHelperDialog";

import { TripPointType } from "../../../../../_entities/trip.entity";
import { CurrentDrawTripUtils } from "../../../../../utils/currentDrawTrip.utils";
import { getSchools } from "../../../map/component/organism/SchoolPoints";
import {
  getStops,
  leafletStopsFilter,
} from "../../../map/component/organism/StopPoints";
import { currentDrawTrip } from "../organism/DrawTripBoard";
import "./DrawHelperButton.css";

interface DrawHelperButtonProps {
  schools: SchoolType[] | undefined;
}

async function drawHelper(data: DrawHelperDataType) {
  enableSpinningWheel();
  const response = await GraphicageService.drawHelper(data);
  //TODO Resolve type problem and add quantity here ?
  const points: TripPointType[] = formatTripPoints(response);
  CurrentDrawTripUtils.updatePoints(points);
  disableSpinningWheel();
}

export function DrawHelperButton(props: DrawHelperButtonProps) {
  async function requestCircuit(
    capacity: number,
    timeLimitSeconds: number,
    nbLimitSolution: number
  ) {
    const schools: SchoolType[] =
      props.schools != undefined
        ? JSON.parse(JSON.stringify(props.schools))
        : [];

    const selectedStops = JSON.parse(
      JSON.stringify(currentDrawTrip()?.tripPoints)
    );

    const stops = leafletStopsFilter();

    const data: DrawHelperDataType = {
      schools: schools,
      selected: selectedStops,
      stops: stops,
      capacity: capacity,
      timeLimitSeconds: timeLimitSeconds,
      nbLimitSolution: nbLimitSolution,
    };

    await drawHelper(data);
  }

  async function onclick() {
    openDrawHelperDialog();
  }

  return (
    <div class="graphicage-draw-helper-button">
      <DrawHelperDialog requestCircuit={requestCircuit} />
      <Show when={currentDrawTrip()?.tripPoints.length ?? 0 > 0}>
        <button onClick={onclick}>
          <FaSolidWandMagicSparkles />
        </button>
      </Show>
    </div>
  );
}

function formatTripPoints(
  data: { id: number; leafletId: number; nature: string; quantity: number }[]
): TripPointType[] {
  const points = [...getSchools(), ...getStops()];
  const output = [];
  for (const item of data) {
    const point = points.find((point) => item.leafletId == point.leafletId);
    if (point) output.push({ ...point, quantity: item.quantity ?? 0 });
  }
  return output;
}
