import { Show } from "solid-js";

import { FaSolidWandMagicSparkles } from "solid-icons/fa";
import { SchoolType } from "../../../../../_entities/school.entity";
import DrawHelperDialog, {
  openDrawHelperDialog,
} from "../molecule/DrawHelperDialog";

import { DrawHelperEntity } from "../../../../../_entities/drawhelper.entity";
import { DrawHelperUtils } from "../../../../../utils/drawHelper.utils";
import { currentDrawTrip } from "../organism/DrawTripBoard";
import "./DrawHelperButton.css";

interface DrawHelperButtonProps {
  schools: SchoolType[] | undefined;
}

export function DrawHelperButton(props: DrawHelperButtonProps) {
  async function requestCircuit(
    capacity: number,
    timeLimitSeconds: number,
    nbLimitSolution: number
  ) {
    await DrawHelperUtils.drawHelper(
      DrawHelperEntity.format(
        capacity,
        timeLimitSeconds,
        nbLimitSolution,
        props.schools ?? []
      )
    );
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
